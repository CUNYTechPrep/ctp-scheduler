import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles({
  root: {},
  media: {
    height: '100vh',
    width: '100vw'
  }
})

export default function MediaCard() {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Tell us about your background"
      />
      <CardActionArea>
        <CardMedia
          className={classes.media}
          component="iframe"
          src="https://docs.google.com/forms/d/e/1FAIpQLSc6Xl5_9VaUiDvPjXuQufZ4uYAlplzC2jHzhuABTTJkY57w-w/viewform?embedded=true"
          title="Contemplative Reptile"
        />
        <CardContent></CardContent>
      </CardActionArea>
      <CardActions></CardActions>
    </Card>
  )
}
