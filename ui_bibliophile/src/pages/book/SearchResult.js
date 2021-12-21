import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";

import BookCard from "../../components/BookCard";
import UserCard from "../../components/UserCard";
import { getSearchResults } from "../../helpers/BookAPICalles";
import { getUserSearchResults } from "../../helpers/ProfileHelper";
import defaultBook from "../../images/default-book.jpg";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "20px",
    "& section": {
      backgroundColor: "#f2f2f2",
      padding: "10px",
      marginBottom: "20px",
      borderRadius: "5px",
    },
  },
  title: {
    padding: "3px",
    margin: "20px 0px",
    textAlign: "center",
    backgroundColor: "white",
  },
  tags: {
    textAlign: "center",
  },
  active: {
    backgroundColor: "#dddddd",
  },
  gridwraper:{
    display: 'flex',
    alignItems:'center',
    justifyContent: 'center',
  },
}));

const SearchResult = () => {
  const classes = useStyles();
  const { searchKey } = useParams();

  const [userSearchResult, setUserSearchResult] = useState([]);
  const [bookSearchResult, setBookSearchResult] = useState([]);
  const [tagAll, setTagAll] = useState(false);
  const [tagUser, setTagUser] = useState(false);
  const [tagBook, setTagBook] = useState(true);

  useEffect(() => {
    getSearchResults(searchKey)
      .then((res) => setBookSearchResult(res))
      .catch((err) => console.log(err));

    getUserSearchResults(searchKey)
      .then((res) => {
        setUserSearchResult(res);
      })
      .catch((err) => console.log(err));
  }, [searchKey]);

  const changeAll = () => {
    setTagAll(true);
    setTagBook(false);
    setTagUser(false);
  };

  const changeBook = () => {
    setTagAll(false);
    setTagBook(true);
    setTagUser(false);
  };

  const changePeople = () => {
    setTagAll(false);
    setTagBook(false);
    setTagUser(true);
  };

  return (
    <Container className={classes.container}>
      <section>
        <div className={classes.tags}>
          <Button onClick={changeAll} className={tagAll && classes.active}>
            All
          </Button>
          <Button onClick={changeBook} className={tagBook && classes.active}>
            Books
          </Button>
          <Button onClick={changePeople} className={tagUser && classes.active}>
            People
          </Button>
        </div>
      </section>
      <section>
        {(tagAll || tagUser) && userSearchResult.length > 0 ? (
          <>
            <Typography variant="h5" className={classes.title}>
              User Search Result
            </Typography>
            <Grid container spacing={1}>
              {userSearchResult.map((user) => {
                return (
                  <Grid key={user.id} item xs={12} sm={4} md={2} className={classes.gridwraper}>
                    <UserCard user={user} />
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          <div></div>
        )}
      </section>
      <section>
        {/* {console.log(searchResult)} */}
        {(tagAll || tagBook) && bookSearchResult.length > 0 ? (
          <>
            <Typography variant="h5" className={classes.title}>
              Books Search Result
            </Typography>
            <Grid container spacing={1}>
              {bookSearchResult.map((book) => (
                <Grid key={book.id} item xs={12} sm={4} md={2} className={classes.gridwraper}>
                  <BookCard
                    book={{
                      id: book.id,
                      image_link_small: book.volumeInfo.imageLinks
                        ? book.volumeInfo.imageLinks.smallThumbnail
                        : defaultBook,
                      title: book.volumeInfo.title,
                      googleSearch: true,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <div></div>
          </>
        )}
      </section>
    </Container>
  );
};

export default SearchResult;
