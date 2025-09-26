import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ✅ Import image from assets folder
import AboutImg from "../assets/aboutus.jpg";

function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-24 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-wide text-gray-900">
            Janith Weerasinghe
          </h1>
          <p className="text-xl text-gray-700 italic">
            Visual Artist & Researcher
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Janith Weerasinghe is a contemporary Sri Lankan artist whose practice
            bridges tradition and modernity, combining painting, pen art, and
            large-scale installations. His work often addresses social, cultural,
            and ecological themes, exploring how humans interact with the natural
            and cultural world.
          </p>
        </section>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
          <p className="text-gray-700">
            Janith holds a Postgraduate degree in Art History and Archeology from
            the University of Colombo (2020), reflecting his deep academic
            engagement with Sri Lankan culture and history. Prior to that, he
            completed a Bachelor of Arts (Special) in Performing Arts at the
            University of Colombo, Sripalee Campus, Horana (2014), where he
            explored movement, performance, and visual storytelling.
          </p>
          <p className="text-gray-700">
            His academic background informs his visual work, offering a
            conceptual depth that merges rigorous research with expressive
            creativity. By grounding his artistic practice in scholarly insights,
            Janith creates art that resonates with both aesthetic beauty and
            cultural awareness.
          </p>
        </section>

        {/* Exhibitions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Exhibitions & Projects
          </h2>
          <p className="text-gray-700">
            Janith has participated in numerous exhibitions across Sri Lanka,
            from vibrant group shows to solo installations that command immersive
            engagement. His group exhibitions include the celebrated Down Town
            Pulse series in Old Galle Fort Jetty (2024), Kandy (2023), and
            Bekariya Space (2019), as well as "Kalagotti" by Ghosha (2018), each
            reflecting his commitment to social dialogue through art.
          </p>
          <p className="text-gray-700">
            His solo projects, such as the "GEBAKA" Installation (2022) and "Hi"
            Book Fair exhibit (2020), showcase his ability to merge conceptual
            rigor with sensory experience. Earlier works like "Sit Down" (2016)
            highlight his exploration of participatory art, inviting viewers to
            become part of the narrative.
          </p>
        </section>

        {/* Artistic Focus */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Artistic Philosophy
          </h2>
          <p className="text-gray-700">
            At the heart of Janith’s work is a{" "}
            <strong>deep empathy for nature and communities</strong>. A notable
            focus is the human-elephant conflict in Sri Lanka, where urban
            expansion and agriculture disrupt wildlife habitats. His paintings,
            sketches, and installations illuminate the tension and coexistence
            challenges, emphasizing ethical reflection and environmental
            stewardship.
          </p>
          <p className="text-gray-700">
            Janith often blends traditional motifs with modern media, creating a
            dialogue between history and contemporary realities. Pen art allows
            him to capture minute details of wildlife and cultural life, while
            large-scale installations immerse viewers in the environmental and
            social narratives he explores.
          </p>
          <p className="text-gray-700">
            Social painting projects engage local communities, documenting oral
            histories, rituals, and folklore. Through participatory art, Janith
            transforms spectators into collaborators, highlighting the shared
            ownership of cultural heritage.
          </p>

          {/* Image (Single, Centered) */}
          <div className="flex justify-center mt-6">
            <img
              src={AboutImg}
              alt="Installation view resembling GEBAKA project"
              className="rounded-xl shadow-lg max-w-2xl w-full"
            />
          </div>
        </section>

        {/* Insights & Interview */}
        <section className="space-y-8 px-6 md:px-20 py-0.5 bg-gray-50 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Insights & Interview
          </h2>

          <div className="space-y-12">
            {/* Q1 */}
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Why is social painting important in Sri Lanka?
              </h3>
              <p className="text-gray-700 mt-2">
                "Social painting serves as a bridge between communities,
                histories, and collective memory. In a country like Sri Lanka,
                where traditions, folklore, and oral histories play a significant
                role, social painting enables dialogue that transcends age,
                background, and language. It transforms art from a personal
                expression into a shared experience that is both reflective and
                transformative."
              </p>
              <p className="text-gray-700 mt-2">
                "By engaging local communities in collaborative projects, social
                painting encourages citizens to explore their surroundings,
                understand each other’s experiences, and document their narratives
                visually. I have found that when people participate in the
                creation process, the artwork becomes a living testament to social
                cohesion, cultural memory, and empathy."
              </p>
              <p className="text-gray-700 mt-2">
                "In my projects, I often incorporate historical references and
                local motifs to connect contemporary issues with traditional
                knowledge. This way, art becomes a means for storytelling,
                advocacy, and education, highlighting social and environmental
                themes that are otherwise overlooked."
              </p>
            </div>

            {/* Q2 */}
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                What inspired your focus on human-elephant conflict?
              </h3>
              <p className="text-gray-700 mt-2">
                "Living close to rural landscapes, I witnessed the increasing
                tension between human settlements and wild elephants. The conflict
                is not just a logistical problem but a cultural and emotional one.
                Communities live alongside these magnificent creatures, yet
                encroachment and environmental changes have caused clashes that
                are deeply impactful for both humans and wildlife."
              </p>
              <p className="text-gray-700 mt-2">
                "Through my art, I aim to document these interactions and bring
                them into public awareness. I have created installations,
                sketches, and paintings that explore the tension, coexistence, and
                interdependence between humans and elephants. Each piece is
                informed by field research, observations, and interviews with
                local communities, blending art and science into a meaningful
                narrative."
              </p>
              <p className="text-gray-700 mt-2">
                "By highlighting these stories through visual mediums, I hope to
                foster empathy and dialogue, encouraging both conservation and
                community-led solutions. The ultimate goal is to create awareness
                that respects both human needs and the ecological importance of
                elephants in Sri Lanka."
              </p>
            </div>

            {/* Q3 */}
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                How do you choose your medium pen, painting, or installation?
              </h3>
              <p className="text-gray-700 mt-2">
                "Each medium has its own language and ability to communicate
                different aspects of a story. Pen art is ideal for capturing fine
                detail and delicate observations, allowing me to explore
                subtleties in movement, texture, and expression. Painting conveys
                emotion more fluidly, giving room for interpretation, abstraction,
                and immersion. Installations are immersive and spatial they allow
                audiences to physically experience a concept rather than just
                observe it."
              </p>
              <p className="text-gray-700 mt-2">
                "I often begin with sketches and research drawings, then translate
                these ideas into larger paintings or installations. For example,
                my work on urban-wildlife encounters often starts with careful pen
                documentation of elephant tracks, local vegetation, and village
                layouts. Later, I use painting to evoke the emotional atmosphere,
                and installations to create interactive experiences that provoke
                reflection and empathy."
              </p>
              <p className="text-gray-700 mt-2">
                "Ultimately, the choice of medium depends on the narrative I want
                to convey and how I want the audience to engage with it. I believe
                that understanding the strengths of each medium allows for more
                layered, impactful storytelling."
              </p>
            </div>

            {/* Q4 */}
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Your creative philosophy how do research and art intersect?
              </h3>
              <p className="text-gray-700 mt-2">
                "Research is central to my practice. I spend months observing,
                documenting, and conversing with communities before translating
                these insights into art. Every artwork is a reflection of careful
                study, whether it’s field notes, historical context, or ecological
                data. This ensures that the visual representation is accurate,
                meaningful, and culturally sensitive."
              </p>
              <p className="text-gray-700 mt-2">
                "Art is not just visual pleasure it can function as documentation,
                advocacy, and a catalyst for social reflection. By combining
                research with creative expression, I aim to make complex social
                and environmental issues more tangible and emotionally resonant
                for audiences. This approach allows viewers to engage
                intellectually and emotionally, fostering empathy, awareness, and
                dialogue."
              </p>
              <p className="text-gray-700 mt-2">
                "I also encourage collaborative research-based art, inviting
                communities to participate in observation, discussion, and
                creation. This reinforces the idea that art is a collective
                endeavor and a tool for social engagement."
              </p>
            </div>

            {/* Q5 */}
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Can you describe your favorite project?
              </h3>
              <p className="text-gray-700 mt-2">
                "'GEBAKA' was one of my most meaningful projects. It was an
                installation combining sculptures, paintings, and interactive
                elements that explored community relationships with local
                landscapes and wildlife. Visitors could physically navigate the
                installation, experiencing the tension between human expansion and
                ecological preservation."
              </p>
              <p className="text-gray-700 mt-2">
                "The project was unique because it blended observation, research,
                and community input. I incorporated stories from villagers,
                ecological data, and historical references to create a narrative
                that was both visually compelling and educational. The response
                from visitors was remarkable they left contemplating their role in
                environmental stewardship and the delicate balance between human
                needs and wildlife."
              </p>
              <p className="text-gray-700 mt-2">
                "This experience reaffirmed my belief in art as a powerful medium
                for education and dialogue. It is one thing to read about conflict
                or conservation; it is another to step into a visual and sensory
                representation of that reality."
              </p>
            </div>
          </div>
        </section>

        {/* Quotes Section */}
        <section className="bg-gray-100 p-8 rounded-xl text-center space-y-4">
          <p className="text-xl italic text-gray-800">
            "Through pen, brush, and installation, I capture the unseen dialogues
            between humans and nature." – Janith Weerasinghe
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
