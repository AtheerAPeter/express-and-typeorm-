const resError = (res, error, status = 400) => {
  let response = { status: false, error };
  res.statusCode = status;
  return res.json(response);
};

const resData = (res, data, status = 200) => {
  let response = { status: true, data };
  res.statusCode = status;
  return res.json(response);
};

export { resError, resData };
