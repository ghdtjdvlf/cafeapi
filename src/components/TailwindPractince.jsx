function Tailwind() {
  return (
    <>

      <div className="flex gap-1 justify-center items-center p-5">
        <div className="w-[200px] h-[200px] bg-amber-200 border-8 border-black rounded-2xl pb-10" >
          <p className="text-5xl text-[50px] font-bold  cursor-pointer"> 111</p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 flex-col">
        <div className="w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
        <div className="w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
        <div className="w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
      </div>

      <div className="grid grid-cols-3 justify-items-center items-center mx-auto w-[1200px]">
        <div className="hover:bg-purple-50 transition w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
        <div className="hover:text-purple-100 mx-auto hover:text-8xl transition w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
        <div className="w-64 h-64 bg-pink-400 text-[50px] text-black">
          111
        </div>
      </div>

      
    </>
  );
}

export default Tailwind;
