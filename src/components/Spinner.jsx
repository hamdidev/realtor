import spinner from "../assets/svg/spinner.svg";

export default function Spinner() {
  return (
    <div className="bg-black opacity-50 flex items-center justify-center fixed z-50 top-0 left-0 right-0 bottom-0">
      <div>
        <img src={spinner} alt="Loading..." className="h-24" />
      </div>
    </div>
  );
}
