import Landing from './components/Landing';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <div className="relative min-h-screen bg-[#000000] selection:bg-brand-accent selection:text-white">
      <div className="noise" />
      <CustomCursor />
      <main>
        <Landing />
      </main>
    </div>
  );
}

export default App;


