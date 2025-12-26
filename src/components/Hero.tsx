//import './hero.css'

function Hero() {
    return (
        <> 
        <section className="hero">
            <div className="hero-content">
                <h1>Hi, I'm Alexandre Robin</h1>
                <p>Product Manager & Producer shaping large-scale entertainment experiences</p>
            </div>
        </section>
        <section className="about">
            <div className="about-content">
                <h2>About Me</h2>
                <p>
                    I’m a Product Manager and Producer with a hybrid background spanning HR, IT, strategy and production.

Over the past 10 years at Ubisoft and in consulting, I’ve worked across organization design, internal platforms, and large-scale entertainment products, from early discovery to live operations.

I enjoy working at the intersection of people, systems and execution, especially in complex environments where alignment and clarity matter as much as delivery.
                </p>
            </div>

            <button className="contact-button" onClick={() => window.location.href = 'mailto:hello@alexandrerobin.fr'}> Contact Me </button>
                <button className="contact-button" onClick={() => window.location.href = 'https://www.linkedin.com/in/robinalexandre/'}> LinkedIn </button>
        </section>
        </>
    )
}

export default Hero