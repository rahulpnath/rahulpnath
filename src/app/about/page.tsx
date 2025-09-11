import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
        <h1>About Me</h1>
        
        <div className="not-prose flex items-center gap-6 my-8">
          <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
              YN
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your Name
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Web Developer & Technology Enthusiast
            </p>
          </div>
        </div>

        <p>
          Welcome to my digital space! I'm passionate about creating meaningful web experiences 
          and sharing knowledge with the developer community.
        </p>

        <h2>What I Do</h2>
        <p>
          I specialize in modern web development technologies including React, Next.js, TypeScript, 
          and Node.js. I love building scalable applications and exploring new technologies.
        </p>

        <h2>My Journey</h2>
        <p>
          My journey in web development started several years ago, and I've been continuously 
          learning and growing ever since. I believe in sharing knowledge and helping others 
          in their development journey.
        </p>

        <h2>Beyond Code</h2>
        <p>
          When I'm not coding, you can find me exploring new technologies, reading tech blogs, 
          or working on personal projects. I'm always excited to connect with fellow developers 
          and learn from their experiences.
        </p>

        <h2>Get in Touch</h2>
        <p>
          Feel free to reach out if you'd like to connect, collaborate, or just have a chat 
          about technology and development.
        </p>
      </div>
    </div>
  );
}