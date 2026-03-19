function Spinner({scale}) {
  return (
    <div>
      <img
        src="https://i0.wp.com/css-tricks.com/wp-content/uploads/2021/08/s_2A9C470D38F43091CCD122E63014ED4503CAA7508FAF0C6806AE473C2B94B83E_1627522653545_loadinfo.gif?resize=200%2C200&ssl=1"
        className={`w-6 h-6 scale-${scale}`}
      />
    </div>
  );
}
export default Spinner;
