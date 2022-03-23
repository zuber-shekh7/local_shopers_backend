const setCookie = (token, res) => {
  const options = {
    expire: new Date(Date.now() * 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options);
};

export { setCookie };
