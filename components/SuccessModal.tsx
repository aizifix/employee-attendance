import Link from "next/link";

const RenderSuccess: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-5 rounded-[0.5rem] shadow-lg text-center m-4 flex flex-col items-center">
      <div className="h-[35px] w-[35px] flex items-center justify-center rounded-full bg-[#277c49] mb-3">
        <i className="bx bx-check font-bold text-2xl text-white" />
      </div>
      <h2 className="text-2xl font-bold text-black mb-2">Success</h2>
      <p>
        Your account has been created, you can now proceed to log in. Have fun
        in IT days!
      </p>
      <Link
        href="/"
        className="mt-4 bg-[#277c49] text-white py-2 px-7 rounded-[0.35rem]"
      >
        Log in
      </Link>
    </div>
  </div>
);

export default RenderSuccess;
