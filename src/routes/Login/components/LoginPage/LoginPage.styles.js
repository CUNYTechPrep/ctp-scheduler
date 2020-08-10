import url from '../../../../static/user.jpeg'
export default (theme) => ({
  image: {
    height: "100vh",
    backgroundPosition: "center",
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
  },
   paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  root: {
        height: '100vh',
        width: "100%"

  },
  panel: {
    ...theme.flexColumnCenter,
    justifyContent: "center",
    flexGrow: 1,
    padding: "1.25rem",
    minWidth: "250px",
    minHeight: "270px",
  },
  orLabel: {
    marginTop: "1rem",
    marginBottom: ".5rem",
  },
  signup: {
    ...theme.flexColumnCenter,
    justifyContent: "center",
    marginTop: "2rem",
  },
  signupLabel: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  signupLink: {
    fontSize: "1.2rem",
  },
  providers: {
    marginTop: "1rem",
  },
});
