export function timer() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return reject(new Error("Request took too long. Please try again"));
    }, 10000);
  });
}

//this is my client id
export const clientId = import.meta.env.VITE_CLIENT_ID;
export const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

//this is our default time frame for every search
export const timeFrame = "short_term";
export const dataLimit = 20;
export const dataOffset = 0;
