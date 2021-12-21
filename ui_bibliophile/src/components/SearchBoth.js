import React, { useState, useRef } from "react";
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
import { getUserSearchResults } from "../helpers/ProfileHelper";
import defaultBook from "../images/default-book.jpg";
import defaultUserImage from "../images/user.png";

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
    maxHeight: "500px",
    color: "black",
    position: "absolute",
    backgroundColor: "#dedede",
    padding: "10px",
    fontSize: "18px",
    border: "1px solid black",
    borderBottomLeftRadius: "10px",
    borderBottomRightRadius: "10px",
    overflowY: "scroll",
    zIndex: "2",
  },
  ss: {
    padding: "5px 2px",
    cursor: "pointer",
    marginBottom: "3px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  seeall: {
    bottom: 0,
    padding: "5px 3px",
    backgroundColor: "#dedede",
    cursor: "pointer",
  },
  seealltext: {
    display: "block",
    textAlign: "center",
    color: "blue",
  },
  people: {
    marginLeft: "20px",
    fontSize: "15px",
  },
}));

const SearchAuto = () => {
  const classes = useStyle();
  const navigate = useNavigate();

  const [searchKey, setSearchKey] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const old_text = useRef("");

  const handleChange = (e) => {
    let text = e.target.value;
    let matches = [];

    if (text.length > 0) {
      setTimeout(() => {
        text = e.target.value;
        if (text !== old_text.current) {
          // console.log(text, old_text.current);
          old_text.current = text;
          getUserSearchResults(searchKey)
            .then((res) => {
              if (res) {
                // console.log(res);
                if (res.length > 5) {
                  matches = matches.concat(res.slice(0, 5));
                } else {
                  matches = matches.concat(res);
                }
              }
            })
            .catch((err) => console.log(err));

          getSearchResults(text).then((res) => {
            if (res) {
              let bookMatches = res.map((book) => {
                let link =
                  book.volumeInfo.title.split(" ").join("-") + `-id-${book.id}`;
                return {
                  name: book.volumeInfo.title,
                  id: book.id,
                  image: book.volumeInfo.imageLinks
                    ? book.volumeInfo.imageLinks.smallThumbnail
                    : defaultBook,
                  public_url: link,
                  isBook: true,
                };
              });
              matches = matches.concat(bookMatches);
              matches = matches.slice(0, 10);
              // console.log(matches);
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
    console.log("Is Book:", isBook);
    setSearchKey(text);
    setSuggestions([]);
    if (isBook) navigate(`/books/${link}`);
    else navigate(`/profile/${link}`);
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
                  <img
                    alt={suggestion.name}
                    src={
                      suggestion.isBook
                        ? suggestion.image
                        : suggestion.profile_picture
                        ? suggestion.profile_picture
                        : defaultUserImage
                    }
                    height={50}
                    width={50}
                  />
                  {suggestion.name}
                </div>
              );
            })}
            <div className={classes.seeall} onClick={handleSearch}>
              <span className={classes.seealltext}>See All Result</span>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default SearchAuto;
