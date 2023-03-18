
export const getUserData = async function getUser() {
  try {
    const response = await axios.get(`https://pixabay.com/api/?key12470042-156b4534868fdb2d637b9b4f4&q={inputValue}&image_type=photo&orientation=horizontal&safesearch=true`);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}