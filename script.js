function handleCredentialResponse(response) {
  console.log("Google Sign-In Response:", response);
  const responsePayload = decodeJwtResponse(response.credential);
  console.log("User Info:", responsePayload);

  // Redirect to the API page after successful sign-in
  window.location.href = "api.html";
}

function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}