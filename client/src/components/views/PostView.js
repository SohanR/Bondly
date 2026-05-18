import { Container, Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import Comments from "../Comments";
import ErrorAlert from "../ErrorAlert";
import { isLoggedIn } from "../../helpers/authHelper";
import TopTags from "../TopTags";

const PostView = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();
  const token = user && user.token;

  const fetchPost = useCallback(async () => {
    setLoading(true);
    const data = await getPost(params.id, token);
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  }, [params.id, token]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        leftRail={<TopTags />}
        left={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />

              <Comments />
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default PostView;
