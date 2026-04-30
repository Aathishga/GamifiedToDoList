const Achievement = ({ text }) => {
  return (
    <div className="fixed top-5 right-5 bg-yellow-400 text-black px-4 py-3 rounded-xl shadow-lg animate-bounce">
      🎉 {text}
    </div>
  );
};

export default Achievement;