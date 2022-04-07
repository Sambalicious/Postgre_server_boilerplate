exports.apiResponse = ({ code = 200, data = null, errorMessage = '' }) => {
    let response;
    if (code === 200) {
      response = {
        Data: data,
        ResponseType: 'SUCCESS',
        StatusCode: 'OK',
        Message: '',
        MessageTitle: 'Good Job',
        Version: "1.0",
      };
    } else {
      response = {
        ResponseType: 'ERROR',
        Message: errorMessage,
        MessageTitle: 'Error',
        StatusCode: 'ERROR',
        Version: "1.0",
      };
    }
  
    return response;
  };