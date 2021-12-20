import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    skeleton:{
        margin: '6px'
    }
}))

const BookSkeleton = () => {
    const classes = useStyles();
    return (
        <div className={classes.skeleton}>
            <Skeleton animation="wave" variant="rect" width={150} height={200} />
            &nbsp;
            <Skeleton animation="wave" variant="rect" width={150} height={40} />
        </div>
    )
}

export default BookSkeleton
