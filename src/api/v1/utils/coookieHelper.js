const setCookie = (token, res) => {
  const options = {
    expire: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  res.cookie("token", token, options);
};

export { setCookie };
