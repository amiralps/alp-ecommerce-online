"use client";
function Error({error, reset}) {
  console.log(error);
  return (
    <div className="errorPage">
      <h1>خطای غیرمنتظره رخ داده است</h1>
	  <button onClick={() => {reset()}}>امتحان دوباره</button>
    </div>
  );
}
export default Error;
