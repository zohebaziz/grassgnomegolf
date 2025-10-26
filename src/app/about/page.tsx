'use client'

const About = () => {
  return (
        <div className="scroll-container">
      <section className="section flex flex-col justify-center items-center text-center p-8">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-shadow-xl">Grass Gnome Golf</h1>
        <p className="text-2xl md:text-3xl text-text/80 mb-8">A Whimsical Adventure</p>
        <a
          href="https://store.steampowered.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary hover:bg-primary-darker text-white font-bold py-4 px-10 rounded-lg text-xl transition-colors"
        >
          Sign up for early access
        </a>
      </section>
      <section className="section flex justify-center items-center p-8">
        <div className="max-w-6xl mx-auto bg-surface-background backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4">About The Game</h2>
            <p className="text-lg text-text/80">
              Get ready to tee off in Grass Gnome Golf, a whimsical golf adventure where you'll navigate enchanted forests, mischievous gnomes, and physics-defying courses. It's a game of skill, luck, and a little bit of gnome magic.
            </p>
          </div>
          <div className="bg-black/30 w-full h-80 rounded-lg flex items-center justify-center">
            <p className="text-white/50">Game Trailer Placeholder</p>
          </div>
        </div>
      </section>
      <section className="section flex justify-center items-end">
        <div className="flex items-center flex-col justify-between h-3/4 w-full">
          <div className="max-w-4xl mx-auto bg-surface-background backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-4xl font-bold mb-8">About The Creator</h2>
            <p className="text-lg text-text/80 mb-8">
              Grass Gnome Golf is brought to you by a passionate solo developer who loves creating charming and challenging games. With a background in art and a passion for gaming, the creator has poured their heart into making this a truly unique experience.
            </p>
            <div className="flex justify-center gap-8">
              <a href="#" className="text-primary hover:underline">Twitter</a>
              <a href="#" className="text-primary hover:underline">Instagram</a>
              <a href="#" className="text-primary hover:underline">TikTok</a>
            </div>
          </div>
          <footer className="text-center py-8 w-full bg-black/30">
            <p>&copy; 2025 Grass Gnome Golf. All rights reserved.</p>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default About;