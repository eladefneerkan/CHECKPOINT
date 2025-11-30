module.exports = {
    sign: jest.fn(() => "mocked.jwt.token"),
    verify: jest.fn(() => ({ id: "mockUserId123", username: "mockuser" }))
  };
  