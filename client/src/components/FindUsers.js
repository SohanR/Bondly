import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { MdGroups, MdRefresh, MdSearch } from "react-icons/md";
import { getRandomUsers } from "../api/users";
import Loading from "./Loading";
import HorizontalStack from "./util/HorizontalStack";
import UserEntry from "./UserEntry";

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [count, setCount] = useState(0);

  const fetchUsers = useCallback(async ({ searchTerm = search, pageNumber = 1 } = {}) => {
    setLoading(true);
    const trimmedSearch = searchTerm.trim();
    const query = { size: 5 };

    if (trimmedSearch) {
      query.search = trimmedSearch;
      query.page = pageNumber;
    }

    const data = await getRandomUsers(query);
    setLoading(false);

    if (trimmedSearch) {
      setUsers(Array.isArray(data?.data) ? data.data : []);
      setCount(data?.count || 0);
      setHasMore(Boolean(data?.hasMore));
      return;
    }

    setUsers(Array.isArray(data) ? data : []);
    setCount(0);
    setHasMore(false);
  }, [search]);

  const handleClick = () => {
    fetchUsers();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers({ pageNumber: nextPage });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({ searchTerm: search, pageNumber: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  const suggestedUsers = Array.isArray(users) ? users : [];
  const isSearching = search.trim().length > 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 2,
        background:
          "linear-gradient(135deg, rgba(46, 125, 50, 0.07), rgba(15, 23, 42, 0.02))",
      }}
    >
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack spacing={1.25}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "success.main",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 8px 22px rgba(46, 125, 50, 0.12)",
                fontSize: 22,
              }}
            >
              <MdGroups />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                Discover People
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Find voices worth following
              </Typography>
            </Box>
          </HorizontalStack>
          {isSearching ? (
            <Button
              variant="outlined"
              size="small"
              disabled={loading || !hasMore}
              onClick={handleNext}
              sx={{
                minWidth: 64,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Next
            </Button>
          ) : (
            <IconButton
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                color: "text.secondary",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  color: "success.main",
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                  borderColor: "success.light",
                },
              }}
              disabled={loading}
              onClick={handleClick}
            >
              <MdRefresh />
            </IconButton>
          )}
        </HorizontalStack>

        <TextField
          size="small"
          placeholder="Search by name or username"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "background.paper",
              fontWeight: 600,
              fontSize: 13,
              "& fieldset": {
                borderColor: "divider",
              },
              "&:hover fieldset": {
                borderColor: "success.light",
              },
              "&.Mui-focused fieldset": {
                borderColor: "success.main",
                borderWidth: 1,
              },
            },
            "& .MuiInputBase-input": {
              fontSize: 13,
              py: 1,
            },
            "& .MuiInputBase-input::placeholder": {
              fontSize: 12,
              opacity: 0.72,
            },
            "& .MuiInputAdornment-root": {
              mr: 0.5,
            },
          }}
        />

        {loading ? (
          <Loading />
        ) : (
          <Stack spacing={1.25}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 800, textTransform: "uppercase" }}
            >
              Suggested people
            </Typography>
            {isSearching && (
              <Typography variant="caption" color="text.secondary">
                {count} result{count === 1 ? "" : "s"} found
              </Typography>
            )}
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((user, index) => (
                <UserEntry
                  username={user.username}
                  name={user.name}
                  key={`${user._id || user.username}-${index}`}
                />
              ))
            ) : (
              <Typography color="text.secondary" variant="body2">
                {isSearching ? "No people found" : "No people available"}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default FindUsers;
