import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  makeStyles,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import ClearIcon from "@mui/icons-material/Clear";
import { getSearchResults } from "../helpers/BookAPICalles";
import { getAllUsers } from "../helpers/ProfileHelper";

const useStyle = makeStyles((theme) => ({
  search: {
    // margin
  },
  searchField: {
    backgroundColor: "white",
    paddingLeft: "3px",
    borderBottom: "0px",
    border: "1px solid white",
    borderRadius: "3px",
  },
  suggestionDiv: {
    maxHeight: "300px",
    color: "black",
    position: "absolute",
    backgroundColor: "white",
    padding: "10px",
    fontSize: "18px",
    border: "1px solid black",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    overflowY: "scroll",
    zIndex: "2",
  },
  ss: {
    borderBottom: "1px solid black",
    padding: "5px 2px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#d4d4d4",
    },
    hidden: {
      display: "none",
    },
  },
  people: {
    marginLeft: '20px',
    color: '#898989',
    fontSize: '15px'
  }
}));

const SearchAuto = () => {
  const classes = useStyle();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const old_text = useRef("");

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    let text = e.target.value;

    let matches = [];

    if (text.length > 0) {
      setTimeout(() => {
        text = e.target.value;
        matches = users.filter((user) => {
          const regex = new RegExp(`${text}`, "gi");
          return user.name.match(regex);
        });
        // console.log(text, matches);

        if (text !== old_text.current) {
          // console.log(text, old_text.current);
          old_text.current = text;
          getSearchResults(text).then((res) => {
            if (res) {
              let bookMatches = res.map((book) => {
                let link = book.volumeInfo.title.split(" ").join("-") + `-id-${book.id}`;
                return {
                  name: book.volumeInfo.title,
                  id: book.id,
                  public_url: link,
                  isBook: true
                };
              });
              matches = matches.concat(bookMatches)
            }
            setSuggestions(matches);
            // console.log(matches);
          });
        }
      }, 2000);
    } else {
      setSuggestions([]);
    }
    setSuggestions(matches);
    setSearchKey(text);
  };

  const onSuggestClickHandler = (text, link, isBook) => {
    console.log("Is Book:",isBook);
    setSearchKey(text);
    setSuggestions([]);
    if(isBook)
      navigate(`/books/${link}`);
    else
      navigate(`/profile/${link}`);
  };

  const handleSearch = () => {
    // console.log(searchKey);
    try {
      if (searchKey) {
        navigate(`/search/${searchKey}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // book.title.split(" ").join("-") + `-id-${book.id}`;
  const clearInput = () => {
    setSearchKey("");
  };

  return (
    <div className={classes.search}>
      <TextField
        placeholder="Search"
        className={classes.searchField}
        value={searchKey}
        onChange={handleChange}
        onBlur={() => {
          setTimeout(() => {
            setSuggestions([]);
          }, 1000);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
             {searchKey.length === 0 ? (
                <IconButton onClick={handleSearch}>
                  <SearchOutlined />
                </IconButton>
              ) : (
                <IconButton onClick={clearInput}>
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
      {suggestions.length > 0 && (
        <div className={classes.suggestionDiv}>
          <>
            <div className={classes.ss} onClick={handleSearch}>
              {searchKey} {<span className={classes.people}>(all)</span>}
            </div>
            {suggestions.map((suggestion, i) => {
              return (
                <div
                  key={i}
                  className={classes.ss}
                  onClick={() =>
                    onSuggestClickHandler(
                      suggestion.name,
                      suggestion.public_url,
                      suggestion.isBook
                    )
                  }
                >
                  {suggestion.name} {!suggestion.isBook && <span className={classes.people}>(People)</span>}
                </div>
              );
            })}
          </>
        </div>
      )}
    </div>
  );
};

export default SearchAuto;

