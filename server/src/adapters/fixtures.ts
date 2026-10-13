import { ExtractedFields } from '../types/index.js';

export interface PublicSnapshotFixture {
  name: string;
  linkedinUsername: string;
  instagramUsername: string;
  avatarUrl: string;
  bioHeadline: string;
  linkedin: {
    rawExcerpt: string;
    fields: ExtractedFields;
  };
  instagram: {
    rawExcerpt: string;
    fields: ExtractedFields;
  };
}

export const VERIFIED_FIXTURES: Record<string, PublicSnapshotFixture> = {
  // 1. Satya Nadella
  satyanadella: {
    name: 'Satya Nadella',
    linkedinUsername: 'satyanadella',
    instagramUsername: 'satyanadella',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Chairman and CEO at Microsoft',
    linkedin: {
      rawExcerpt: 'Chairman and CEO of Microsoft. Passionate about empowering every person and organization on the planet to achieve more. Focused on AI transformation, cloud infrastructure, cricket, reading poetry, and empathetic leadership.',
      fields: {
        headline: 'Chairman and CEO at Microsoft',
        bio: 'Empowering every person and organization on the planet to achieve more through technology and culture.',
        summary: 'Focused on cloud computing, generative AI, systems architecture, and empathetic organizational cultures. Lifelong learner with a passion for cricket and literature.',
        recentTopics: ['Empathetic Leadership', 'Cloud & AI Systems', 'Global Economic Growth', 'Cricket & Philosophy'],
        publicTags: ['Technology', 'Leadership', 'Cricket', 'Literature'],
        experienceHighlights: ['CEO at Microsoft (2014-present)', 'Executive VP Cloud & Enterprise'],
        locationHint: 'Seattle, WA',
      },
    },
    instagram: {
      rawExcerpt: 'Public moments, book recommendations, cricket tournament glimpses, accessibility initiatives, and campus walks.',
      fields: {
        bio: 'Father, reader, cricket fan, technology optimist.',
        recentTopics: ['Weekend cricket matches', 'Accessibility hardware', 'Favorite books on history and poetry', 'Pacific Northwest hikes'],
        publicTags: ['Cricket', 'Books', 'Accessibility', 'Morning Walks'],
        contentSignals: ['Books & Poetry', 'Outdoor strolls', 'Sports enthusiast', 'Family-oriented'],
      },
    },
  },

  // 2. Mira Murati
  miramurati: {
    name: 'Mira Murati',
    linkedinUsername: 'miramurati',
    instagramUsername: 'miramurati',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'AI Technologist & Former CTO',
    linkedin: {
      rawExcerpt: 'Engineer and researcher leading frontier generative models, neural architectures, human-AI alignment, and multidisciplinary scientific collaborations.',
      fields: {
        headline: 'AI Technologist & Systems Researcher',
        bio: 'Building safe, aligned frontier artificial intelligence systems.',
        summary: 'Background in mechanical engineering, aerospace systems, augmented reality, and leading cross-functional AI research and product deployment.',
        recentTopics: ['Neural Alignment', 'Multimodal Systems', 'Engineering Rigor', 'Piano & Classical Music'],
        publicTags: ['Deep Learning', 'Aerospace', 'Classical Music', 'Philosophy of Mind'],
        experienceHighlights: ['CTO at OpenAI', 'VP Product & Engineering at Leap Motion', 'Senior Product Manager at Tesla Motors'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Concert halls, modern art galleries, espresso counters in North Beach, vintage sci-fi books, and seaside cliffs.',
      fields: {
        bio: 'Science, sound, architecture, and machines.',
        recentTopics: ['Art biennials', 'Espresso preparation', 'Chopin nocturnes', 'Coastal drives on Highway 1'],
        publicTags: ['Modern Art', 'Specialty Coffee', 'Classical Piano', 'Architecture'],
        contentSignals: ['Aesthetic eye', 'Coffee enthusiast', 'Art gallery visitor', 'Reflective conversations'],
      },
    },
  },

  // 3. Marques Brownlee
  mkbhd: {
    name: 'Marques Brownlee',
    linkedinUsername: 'mkbhd',
    instagramUsername: 'mkbhd',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Tech Creator & Professional Ultimate Frisbee Player',
    linkedin: {
      rawExcerpt: 'Independent tech media creator producing in-depth consumer electronics reviews, studio production workflows, electric vehicle testing, and industrial design critiques.',
      fields: {
        headline: 'Tech Video Producer & Host at MKBHD',
        bio: 'Quality tech videos | High production values | Professional athlete in AUDL.',
        summary: 'Stevens Institute of Technology graduate with deep focus on consumer technology, high-frame-rate cinematography, clean studio ergonomics, and competitive athletics.',
        recentTopics: ['Industrial Design', 'Electric Vehicles', 'Cinema Cameras & RED Workflows', 'Competitive Ultimate'],
        publicTags: ['Consumer Tech', 'Video Production', 'EVs', 'Ultimate Frisbee'],
        experienceHighlights: ['Founder & Host at MKBHD / Studio (2008-present)', 'Professional Player New York Empire AUDL'],
        locationHint: 'Kearny, NJ',
      },
    },
    instagram: {
      rawExcerpt: 'Crisp product photography, frisbee tournament highlights, matte black studio setups, golf swings, and EV road trips.',
      fields: {
        bio: 'MKBHD. Crispy tech. Ultimate frisbee player. Pro golf learner.',
        recentTopics: ['Matte black aesthetics', 'Ultimate Frisbee tournaments', 'Golf driving range', 'Weekend road trips'],
        publicTags: ['Matte Black Everything', 'Frisbee', 'Golf', 'Sneakers'],
        contentSignals: ['Athletic lifestyle', 'Minimalist aesthetics', 'Weekend road trips', 'High-energy outdoor sports'],
      },
    },
  },

  // 4. Simone Giertz
  simonegiertz: {
    name: 'Simone Giertz',
    linkedinUsername: 'simonegiertz',
    instagramUsername: 'simonegiertz',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Inventor, Maker & Founder at Yetch',
    linkedin: {
      rawExcerpt: 'Inventor and designer specializing in eccentric mechanical hardware, everyday problem-solving objects, and creative product prototyping. Founder of Yetch Store.',
      fields: {
        headline: 'Founder & Product Designer at Yetch Store',
        bio: 'Making useless machines and useful products with delightful mechanical design.',
        summary: 'Prototyper, welder, CAD designer, and creative director behind viral mechanical inventions, converted electric mini-trucks, and everyday stationery design.',
        recentTopics: ['Mechanical Prototyping', 'Product Manufacturing', 'Welding & Woodworking', 'Creative Resilience'],
        publicTags: ['Hardware', 'Industrial Design', 'Comedy', 'Prototyping'],
        experienceHighlights: ['Founder at Yetch (2019-present)', 'Robotics & Hardware Creator'],
        locationHint: 'Los Angeles, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Workshop sawdust, dog adventures with Scraps, welding helmets, quirky furniture builds, and pottery throwing.',
      fields: {
        bio: 'Maker of things. Dog mom to Scraps. Welder. Furniture builder.',
        recentTopics: ['Workshop DIY projects', 'Dog beach trips', 'Throwing ceramic mugs', 'Flea market treasure hunts'],
        publicTags: ['Dogs', 'Workshop', 'Ceramics', 'Vintage Hunting'],
        contentSignals: ['Dog lover', 'Hands-on maker', 'Humorous banter', 'Casual outdoor dates'],
      },
    },
  },

  // 5. Lex Fridman
  lexfridman: {
    name: 'Lex Fridman',
    linkedinUsername: 'lexfridman',
    instagramUsername: 'lexfridman',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'AI Researcher at MIT & Podcast Host',
    linkedin: {
      rawExcerpt: 'Research scientist at MIT working on autonomous vehicles, human-robot interaction, machine learning, and deep long-form dialogue on history, science, and the human condition.',
      fields: {
        headline: 'Research Scientist at MIT | Host, Lex Fridman Podcast',
        bio: 'Autonomous vehicles, human-robot interaction, machine learning, and long-form conversations on science and human nature.',
        summary: 'PhD in Electrical and Computer Engineering from Drexel. Active researcher in human-centered AI, autonomous navigation, and philosophy of science.',
        recentTopics: ['Human-Centered AI', 'Autonomous Driving', 'Philosophy of Consciousness', 'Judo & Brazilian Jiu-Jitsu'],
        publicTags: ['AI Research', 'Jiu-Jitsu', 'Robotics', 'Philosophy'],
        experienceHighlights: ['Research Scientist at MIT (2015-present)', 'Host at Lex Fridman Podcast'],
        locationHint: 'Austin, TX',
      },
    },
    instagram: {
      rawExcerpt: 'BJJ gi workouts, acoustic guitar practice, running in rain, reading Dostoyevsky and Tolstoy, and suit portraits.',
      fields: {
        bio: 'Love, empathy, curiosity. BJJ black belt. Running, guitar, books.',
        recentTopics: ['BJJ training mats', 'Acoustic guitar covers (Beatles, Radiohead)', 'Late night book reflections', 'Endurance marathon runs'],
        publicTags: ['Martial Arts', 'Acoustic Guitar', 'Classic Literature', 'Running'],
        contentSignals: ['Intense conversationalist', 'Disciplined daily routine', 'Deep listener', 'Endurance athletics'],
      },
    },
  },

  // 6. Timnit Gebru
  timnitgebru: {
    name: 'Timnit Gebru',
    linkedinUsername: 'timnitgebru',
    instagramUsername: 'timnitgebru',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder & Executive Director at DAIR Institute',
    linkedin: {
      rawExcerpt: 'Founder of Distributed Artificial Intelligence Research Institute (DAIR). Computer vision researcher, co-founder of Black in AI, advocating for community-grounded AI ethics and data documentation.',
      fields: {
        headline: 'Executive Director at Distributed AI Research Institute (DAIR)',
        bio: 'Researching ethical AI, algorithmic accountability, and community-centered science.',
        summary: 'PhD from Stanford University Computer Vision Lab. Pioneer of Datasheets for Datasets, studying social implications of foundation models and decentralized research hubs.',
        recentTopics: ['AI Accountability', 'Dataset Documentation', 'Community Governance', 'East African Music & Culture'],
        publicTags: ['Ethics in AI', 'Computer Vision', 'Data Ecology', 'Public Policy'],
        experienceHighlights: ['Executive Director at DAIR Institute (2021-present)', 'Co-founder at Black in AI'],
        locationHint: 'Oakland, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Ethiopian coffee ceremonies, vibrant textile markets, garden flora, community dinners, and book club gatherings.',
      fields: {
        bio: 'Scientist, community builder, music lover, gardener.',
        recentTopics: ['Traditional coffee brewing', 'Heirloom gardening', 'Soul and Afrobeat concerts', 'Independent bookshops'],
        publicTags: ['Coffee Ceremony', 'Gardening', 'Music Concerts', 'Book Clubs'],
        contentSignals: ['Community oriented', 'Passionate cook', 'Live music enthusiast', 'Thoughtful dialogue'],
      },
    },
  },

  // 7. Andrej Karpathy
  andrejkarpathy: {
    name: 'Andrej Karpathy',
    linkedinUsername: 'andrejkarpathy',
    instagramUsername: 'karpathy',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'AI Educator, Systems Builder & Researcher',
    linkedin: {
      rawExcerpt: 'Builder of Eureka Labs, founding member of OpenAI, former Director of AI at Tesla Autopilot. Creator of CS231n and deep neural network education series from scratch in pure C and Python.',
      fields: {
        headline: 'Founder at Eureka Labs | Former Director of AI at Tesla',
        bio: 'Building AI native education systems and deep neural nets from scratch.',
        summary: 'PhD Stanford University under Fei-Fei Li. Passionate about distillation of complex ideas, pure C neural network kernels, cognitive science, and endurance running.',
        recentTopics: ['Neural Networks from Scratch', 'AI-Native Education', 'Rubik’s Cube Speedcubing', 'Trail Running'],
        publicTags: ['Deep Learning', 'Pedagogy', 'Systems Engineering', 'Speedcubing'],
        experienceHighlights: ['Founder at Eureka Labs (2024-present)', 'Director of AI at Tesla (2017-2022)', 'Research Scientist at OpenAI'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Speedcubing timers, desk setups with mechanical keyboards, trail runs in Marin Headlands, and minimalist sketchpads.',
      fields: {
        bio: 'Building, learning, running, cube solving.',
        recentTopics: ['Trail running splits', 'Rubik cube algorithms', 'Mechanical keyboard switches', 'Coffee and whiteboards'],
        publicTags: ['Trail Running', 'Speedcubing', 'Keyboards', 'Nature Hikes'],
        contentSignals: ['Deep focus enthusiast', 'Analytical humor', 'Loves nature escapes', 'Curious builder'],
      },
    },
  },

  // 8. Fei-Fei Li
  feifeili: {
    name: 'Fei-Fei Li',
    linkedinUsername: 'feifeili',
    instagramUsername: 'drfeifeili',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Professor of Computer Science at Stanford & Co-Director Stanford HAI',
    linkedin: {
      rawExcerpt: 'Sequoia Professor in the Computer Science Department at Stanford University. Denning Co-Director of Stanford Institute for Human-Centered Artificial Intelligence (HAI). Creator of ImageNet.',
      fields: {
        headline: 'Professor at Stanford University | Co-Director Stanford HAI',
        bio: 'Human-centered artificial intelligence, spatial intelligence, and computer vision.',
        summary: 'Member of the National Academy of Engineering and Medicine. Champion of ethical, diverse, and humanistic technology development.',
        recentTopics: ['Spatial Intelligence', 'Human-Centered AI', 'ImageNet & Visual Genome', 'Healthcare Robotics'],
        publicTags: ['Computer Vision', 'Academia', 'Human-Centered AI', 'Mentorship'],
        experienceHighlights: ['Professor at Stanford University (2009-present)', 'Co-Director at Stanford HAI', 'Chief Scientist AI/ML at Google Cloud'],
        locationHint: 'Palo Alto, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Stanford quad bike rides, family celebrations, nature photography, book signings for The Worlds I See, and botanical gardens.',
      fields: {
        bio: 'Scientist, educator, author of The Worlds I See. Lover of nature and art.',
        recentTopics: ['Botanical garden walks', 'Book readings and mentoring', 'Watercolor painting', 'Pacific ocean sunsets'],
        publicTags: ['Nature Photography', 'Watercolor', 'Botanical Gardens', 'Mentorship'],
        contentSignals: ['Warm and reflective', 'Appreciates fine arts', 'Cherishes deep intellectual conversations', 'Nature lover'],
      },
    },
  },

  // 9. Casey Neistat
  caseyneistat: {
    name: 'Casey Neistat',
    linkedinUsername: 'caseyneistat',
    instagramUsername: 'caseyneistat',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Filmmaker, Creator & Co-founder at Beme',
    linkedin: {
      rawExcerpt: 'Filmmaker, visual storyteller, and technology entrepreneur based in New York City. Pioneer of daily vlogging, guerilla cinema, boosted board transport, and creative entrepreneurship.',
      fields: {
        headline: 'Filmmaker & Visual Storyteller',
        bio: 'Directing films, building media companies, and running NYC streets.',
        summary: 'Decades of independent video direction for HBO, YouTube, and commercial clients. Expert in narrative pacing, run-and-gun production, and marathon training.',
        recentTopics: ['Narrative Filmmaking', 'Marathon Training', 'NYC Street Culture', 'Industrial Studio Organization'],
        publicTags: ['Filmmaking', 'Running', 'New York City', 'Industrial Design'],
        experienceHighlights: ['Filmmaker & YouTube Creator (2010-present)', 'Co-founder at Beme (Acquired by CNN)', 'Creator The Neistat Brothers (HBO)'],
        locationHint: 'New York, NY',
      },
    },
    instagram: {
      rawExcerpt: 'Daily 10-mile runs across Manhattan Bridge, studio workshop tools, broken cameras, family skateboarding, and classic diners.',
      fields: {
        bio: 'NYC. Running, making movies, building things.',
        recentTopics: ['Morning runs over East River bridges', 'Studio welding and 3D printing', 'Skateboarding with kids', 'Vintage diner breakfasts'],
        publicTags: ['Marathon', 'Skateboarding', 'Diners', 'NYC Architecture'],
        contentSignals: ['High adrenaline', 'Relentless work ethic', 'Loves urban exploration', 'Spontaneous storytelling'],
      },
    },
  },

  // 10. Cassidy Williams
  cassidywilliams: {
    name: 'Cassidy Williams',
    linkedinUsername: 'cassidoo',
    instagramUsername: 'cassidoo',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'CTO at Contenda & Developer Advocate',
    linkedin: {
      rawExcerpt: 'Developer advocate, CTO, startup advisor, mechanical keyboard enthusiast, and creator of weekly developer newsletters with interview questions and memes.',
      fields: {
        headline: 'CTO at Contenda | Keyboards, Code & Developer Experience',
        bio: 'Web engineering, developer tooling, startup leadership, and mechanical keyboards.',
        summary: 'Iowa State alum with a track record across Netlify, Remote, Amazon, and GitHub. Specializes in TypeScript, modern web platforms, open source, and developer education.',
        recentTopics: ['Mechanical Keyboards', 'TypeScript & Web Standards', 'Developer Advocacy', 'Board Games & Trivia'],
        publicTags: ['Web Development', 'Keyboards', 'Board Games', 'Standup Comedy'],
        experienceHighlights: ['CTO at Contenda (2022-present)', 'Head of DX at Remote', 'Principal DX at Netlify'],
        locationHint: 'Chicago, IL',
      },
    },
    instagram: {
      rawExcerpt: 'Custom keyboard artisan keycaps, solder fumes, pun shirts, local bakery pastries, and competitive board game nights.',
      fields: {
        bio: 'Code, jokes, keyboards, snacks. Solderer of switches.',
        recentTopics: ['Custom keyboard builds & lubing switches', 'Cozy board game nights (Catan, Wingspan)', 'Baking sourdough and croissants', 'Geeky comedy sets'],
        publicTags: ['Artisan Keyboards', 'Board Games', 'Baking', 'Puns'],
        contentSignals: ['Playful humor', 'Foodie & baker', 'Loves cozy indoor game nights', 'Enthusiastic listener'],
      },
    },
  },

  // 11. Pieter Levels
  pieterlevels: {
    name: 'Pieter Levels',
    linkedinUsername: 'levelsio',
    instagramUsername: 'levelsio',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Solo Bootstrapper & Digital Nomad (Nomad List, Remote OK)',
    linkedin: {
      rawExcerpt: 'Solo software entrepreneur building hyper-profitable web products with minimal stacks (vanilla PHP, SQLite, jQuery). Founder of Nomad List, Remote OK, and PhotoAI.',
      fields: {
        headline: 'Founder at Nomad List, Remote OK & PhotoAI',
        bio: 'Solo founder bootstrapping web products worldwide.',
        summary: 'Pioneer of the 12 startups in 12 months movement and digital nomad ecosystem. Passionate about lean engineering, rapid shipping, AI photography, and electronic music.',
        recentTopics: ['Solo Bootstrapping', 'Digital Nomad Lifestyle', 'Minimalist Stacks', 'Synthesizers & Techno'],
        publicTags: ['Indie Hacking', 'Travel', 'Minimalism', 'Electronic Music'],
        experienceHighlights: ['Founder Nomad List (2014-present)', 'Founder Remote OK', 'Founder PhotoAI'],
        locationHint: 'Lisbon, Portugal',
      },
    },
    instagram: {
      rawExcerpt: 'Rooftop coworking views, espresso in Lisbon and Bali, flight seat maps, modular synth racks, and sunset swimming.',
      fields: {
        bio: 'Bootstrapping apps while traveling the world. Music producer.',
        recentTopics: ['Lisbon sunset cafes', 'Modular synthesizer jams', 'Beach swimming & surfing', 'Travel gear minimalism'],
        publicTags: ['Digital Nomad', 'Surfing', 'Synths', 'Coffee'],
        contentSignals: ['High autonomy', 'Travel enthusiast', 'Minimalist lifestyle', 'Spontaneous adventures'],
      },
    },
  },

  // 12. Swyx (Shawn Wang)
  swyx: {
    name: 'Shawn Wang (Swyx)',
    linkedinUsername: 'swyx',
    instagramUsername: 'swyx',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder at Latent Space & Smarter Systems',
    linkedin: {
      rawExcerpt: 'Co-founder at Latent Space University and Smarter Systems. Former Head of DX at Temporal and Airbyte. Originator of Learn in Public movement and AI Engineer Summit.',
      fields: {
        headline: 'Co-founder Latent Space | Author of The Coding Career Handbook',
        bio: 'AI Engineering, Developer Experience, Learning in Public.',
        summary: 'Pioneered the AI Engineer identity, hosting premier technical conferences and technical deep dives into transformer inference, evals, and agent architectures.',
        recentTopics: ['AI Engineering', 'Evals & Inference Optimization', 'Learn in Public', 'Karaoke & Singaporean Food'],
        publicTags: ['AI Engineering', 'Developer Experience', 'Podcasting', 'Karaoke'],
        experienceHighlights: ['Co-founder Latent Space (2023-present)', 'Head of DX at Temporal Technologies', 'Staff DX Engineer at Netlify'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'AI Engineer Summit main stage, dim sum tables, karaoke lounge videos, ramen crawls, and hackathon judging.',
      fields: {
        bio: 'AI, coding, podcasts, spicy food, karaoke.',
        recentTopics: ['Late night ramen crawls', 'Karaoke belting', 'Hackathon mentoring', 'SF Chinatown dim sum'],
        publicTags: ['Ramen', 'Karaoke', 'Hackathons', 'Dim Sum'],
        contentSignals: ['Social connector', 'Food enthusiast', 'High energy', 'Curious mind'],
      },
    },
  },

  // 13. Kelsey Hightower
  kelseyhightower: {
    name: 'Kelsey Hightower',
    linkedinUsername: 'kelseyhightower',
    instagramUsername: 'kelseyhightower',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Principal Engineer (Ret.) & Tech Minimalist',
    linkedin: {
      rawExcerpt: 'Former Principal Engineer at Google Cloud, open source advocate, co-author of Kubernetes: Up and Running. Known for live keynote demonstrations, empathy in engineering, and software minimalism.',
      fields: {
        headline: 'Principal Engineer (Retired) | Keynote Speaker & Board Member',
        bio: 'Mentorship, open source, simplifying technology and human connections.',
        summary: 'Pioneer of cloud-native infrastructure, containerization, and empathetic developer advocacy. Now focused on family, agricultural homesteading, and community mentorship.',
        recentTopics: ['Software Minimalism', 'Kubernetes The Hard Way', 'Homesteading & Gardening', 'Executive Mentorship'],
        publicTags: ['Open Source', 'Mentorship', 'Cloud Native', 'Simplicity'],
        experienceHighlights: ['Principal Engineer at Google (2015-2023)', 'Staff Advocate at CoreOS', 'Puppet Labs'],
        locationHint: 'Portland, OR',
      },
    },
    instagram: {
      rawExcerpt: 'Backyard vegetable beds, vintage tractor restorations, campfire cooking, vinyl jazz records, and family bike rides.',
      fields: {
        bio: 'Simple living. Family, soil, tools, and good conversation.',
        recentTopics: ['Backyard tomato harvests', 'Smoked BBQ cooking', 'Classic jazz listening sessions', 'Oregon forest walks'],
        publicTags: ['Gardening', 'BBQ Cooking', 'Jazz', 'Forest Trails'],
        contentSignals: ['Grounded philosophy', 'Loves home cooking', 'Warm mentor vibe', 'Values quiet presence'],
      },
    },
  },

  // 14. Mitchell Hashimoto
  mitchellhashimoto: {
    name: 'Mitchell Hashimoto',
    linkedinUsername: 'mitchellh',
    instagramUsername: 'mitchellh',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder at HashiCorp (Vagrant, Terraform, Consul) & Ghostty Creator',
    linkedin: {
      rawExcerpt: 'Co-founder of HashiCorp. Creator of Vagrant, Packer, Serf, Consul, Terraform, and Nomad. Creator of Ghostty terminal emulator and Zig systems software.',
      fields: {
        headline: 'Founder at HashiCorp | Systems Software Engineer (Zig, Ghostty)',
        bio: 'Building foundational developer tools and fast native systems software.',
        summary: 'University of Washington CS graduate. Passionate about aviation (licensed pilot), precision craftsmanship, systems programming in Zig, and mechanical watches.',
        recentTopics: ['Systems Programming (Zig)', 'Ghostty Terminal', 'General Aviation Piloting', 'Mechanical Watchmaking'],
        publicTags: ['Systems Software', 'Aviation', 'Developer Tooling', 'Craftsmanship'],
        experienceHighlights: ['Co-founder & CTO at HashiCorp (2012-2021)', 'Creator of Ghostty (2023-present)'],
        locationHint: 'Los Angeles, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Cockpit instruments over Sierra Nevada, macro photos of watch movements, sourdough crusts, and clean minimal desk setups.',
      fields: {
        bio: 'Software, flight, watches, bread.',
        recentTopics: ['Flying cross-country in single-engine planes', 'Watch movement disassembly', 'Dutch oven sourdough baking', 'Acoustic fingerstyle guitar'],
        publicTags: ['Piloting', 'Horology', 'Sourdough', 'Acoustic Guitar'],
        contentSignals: ['Precision craftsman', 'Loves scenic flights', 'Patient and focused', 'Appreciates quiet mastery'],
      },
    },
  },

  // 15. Guillermo Rauch
  rauchg: {
    name: 'Guillermo Rauch',
    linkedinUsername: 'rauchg',
    instagramUsername: 'rauchg',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'CEO & Founder at Vercel (Next.js)',
    linkedin: {
      rawExcerpt: 'Founder and CEO of Vercel, creator of Socket.io, Mongoose, and Next.js. Dedicated to making the web faster, more accessible, and delightful for millions of developers worldwide.',
      fields: {
        headline: 'CEO and Founder at Vercel',
        bio: 'Making the web faster. Next.js, v0, React, frontend cloud.',
        summary: 'Born in Argentina, self-taught open source developer who created fundamental real-time web libraries. Deep focus on design systems, web performance, and developer ergonomics.',
        recentTopics: ['Web Performance & Edge Computing', 'Design Systems', 'AI Frontend Generation (v0)', 'Yerba Mate & Football'],
        publicTags: ['Frontend Architecture', 'Web Performance', 'Design', 'Yerba Mate'],
        experienceHighlights: ['CEO at Vercel (2015-present)', 'CTO & Co-founder at LearnBoost', 'Creator Socket.io'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Gourd of traditional Yerba Mate, modern typography books, family trips to Buenos Aires, and sleek modernist architecture.',
      fields: {
        bio: 'Web speed, design, mate, family. Next.js & Vercel.',
        recentTopics: ['Morning Yerba Mate ritual', 'Mid-century modernist furniture', 'World Cup soccer matches', 'San Francisco waterfront runs'],
        publicTags: ['Yerba Mate', 'Architecture', 'Soccer', 'Running'],
        contentSignals: ['Cultured and design-first', 'Warm South American hospitality', 'Fast-paced yet centered', 'Loves aesthetic spaces'],
      },
    },
  },

  // 16. Nat Friedman
  natfriedman: {
    name: 'Nat Friedman',
    linkedinUsername: 'natfriedman',
    instagramUsername: 'natfriedman',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Investor, Co-founder Vesuvius Challenge & Former GitHub CEO',
    linkedin: {
      rawExcerpt: 'Investor and systems enthusiast. Former CEO of GitHub, co-founder of Xamarin (acquired by Microsoft) and GNOME Foundation. Organizer of the Vesuvius Challenge CT-scanning ancient Herculaneum papyri.',
      fields: {
        headline: 'Investor & Explorer | Former CEO of GitHub',
        bio: 'Open source, ancient archaeology, AI compute, and bold science.',
        summary: 'MIT graduate. Co-founded GNOME, led GitHub through the launch of GitHub Copilot and Actions, now funding ambitious breakthroughs in archaeology and machine learning.',
        recentTopics: ['Vesuvius Challenge & Archaeology', 'Open Source Ecosystems', 'Deep Tech Seed Investing', 'Historical Non-Fiction'],
        publicTags: ['Archaeology', 'Deep Tech', 'Open Source', 'History'],
        experienceHighlights: ['CEO at GitHub (2018-2021)', 'Co-founder & CEO at Xamarin', 'Co-founder GNOME Foundation'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Archaeological excavation sites in Italy, 3D CT scanner visualizations, rare antique books, and mountain hiking trails.',
      fields: {
        bio: 'Curiosity, ancient scrolls, high performance computers, trail treks.',
        recentTopics: ['Deciphering ancient Greek scrolls', 'Antique printing presses', 'Alpine mountaineering', 'Experimental physics demos'],
        publicTags: ['Antiquities', 'Mountaineering', 'Museums', 'Book Collecting'],
        contentSignals: ['Intellectually adventurous', 'Loves history & mysteries', 'Generous collaborator', 'Expedition enthusiast'],
      },
    },
  },

  // 17. Amjad Masad
  amasad: {
    name: 'Amjad Masad',
    linkedinUsername: 'amasad',
    instagramUsername: 'amasad',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'CEO & Co-founder at Replit',
    linkedin: {
      rawExcerpt: 'Founder and CEO of Replit. Empowering the next billion software creators through in-browser development environments and autonomous coding agents.',
      fields: {
        headline: 'CEO & Co-founder at Replit',
        bio: 'Empowering the next billion software creators with collaborative AI environments.',
        summary: 'Former engineer at Facebook and Codecademy. Deep background in web-based compilers, runtime sandboxes, and democratization of software engineering globally.',
        recentTopics: ['In-Browser Cloud Runtimes', 'AI Software Agents', 'Economic Mobility through Code', 'Ancient Philosophy & Stoicism'],
        publicTags: ['Cloud IDEs', 'Education', 'Stoicism', 'Startups'],
        experienceHighlights: ['CEO at Replit (2016-present)', 'Software Engineer at Facebook', 'Founding Engineer Codecademy'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Weightlifting records in the garage gym, Turkish coffee brewing, chess boards, family picnics in Bay Area parks, and book passages.',
      fields: {
        bio: 'Building Replit. Weightlifting, chess, philosophy, family.',
        recentTopics: ['Powerlifting squats and deadlifts', 'Rapid chess matches', 'Middle Eastern cuisine & cardamom coffee', 'Philosophy book quotes'],
        publicTags: ['Weightlifting', 'Chess', 'Turkish Coffee', 'Stoic Reading'],
        contentSignals: ['Disciplined and determined', 'Loves tactical games', 'Values family and hospitality', 'Thoughtful debater'],
      },
    },
  },

  // 18. Justine Ezarik (iJustine)
  ijustine: {
    name: 'Justine Ezarik (iJustine)',
    linkedinUsername: 'justineezarik',
    instagramUsername: 'ijustine',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Tech Host, Author & Digital Content Pioneer',
    linkedin: {
      rawExcerpt: 'Digital creator, television host, author, and technology reviewer with over 15 years producing consumer technology and gaming content across major media networks.',
      fields: {
        headline: 'Host, Producer & New York Times Bestselling Author',
        bio: 'Consumer technology storytelling, gaming, cooking, and media production.',
        summary: 'Pioneer of video blogging and tech lifestyle broadcasting. Advocate for STEM education, women in technology, and creative storytelling.',
        recentTopics: ['Consumer Hardware Innovations', 'Video Game Streaming', 'Culinary Technology', 'Rescue Animals & Pet Rescue'],
        publicTags: ['Tech Lifestyle', 'Gaming', 'Culinary Arts', 'Animal Rescue'],
        experienceHighlights: ['Creator at iJustine (2006-present)', 'Author I, Justine', 'Host at Same Brain Podcast'],
        locationHint: 'Los Angeles, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Golden retrievers playing in the pool, gadget unboxings, drone flights over Hawaiian coasts, baking vegan sweets, and video game tournaments.',
      fields: {
        bio: 'Tech, gaming, dogs, food, travel! Same Brain podcast host.',
        recentTopics: ['Dog agility training with rescue pups', 'Drone photography along coastline', 'Baking treats with smart ovens', 'Nintendo Switch co-op sessions'],
        publicTags: ['Rescue Dogs', 'Baking', 'Nintendo Gaming', 'Drone Flying'],
        contentSignals: ['Warm, cheerful energy', 'Huge animal lover', 'Loves playful competitive gaming', 'Creative host'],
      },
    },
  },

  // 19. Andrew Ng
  andrewng: {
    name: 'Andrew Ng',
    linkedinUsername: 'andrewyng',
    instagramUsername: 'andrewyng',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder DeepLearning.AI, Managing General Partner AI Fund',
    linkedin: {
      rawExcerpt: 'Co-founder of Coursera, founder of DeepLearning.AI, Adjunct Professor at Stanford University. Former Chief Scientist at Baidu and founding lead of Google Brain.',
      fields: {
        headline: 'Managing General Partner at AI Fund | Founder DeepLearning.AI',
        bio: 'Democratizing AI knowledge and building impactful AI startups.',
        summary: 'Educated millions of engineers in machine learning and deep learning. Passionate about data-centric AI, healthcare applications, and thoughtful education policy.',
        recentTopics: ['Data-Centric AI', 'Global AI Education', 'AI in Healthcare', 'Mentorship & Venture Building'],
        publicTags: ['Machine Learning', 'Education', 'Venture Capital', 'Healthcare'],
        experienceHighlights: ['Founder DeepLearning.AI', 'Co-founder Coursera', 'Adjunct Professor Stanford', 'Founder Google Brain'],
        locationHint: 'Los Altos, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Reading with children, handwritten math equations on chalkboards, family dim sum lunches, and peaceful garden strolls.',
      fields: {
        bio: 'Educator, researcher, parent. Passionate about AI for good.',
        recentTopics: ['Family bike rides', 'Reading picture books with kids', 'Handwritten math derivations', 'Chinese tea appreciation'],
        publicTags: ['Family Time', 'Tea Ceremony', 'Math & Learning', 'Gardening'],
        contentSignals: ['Gentle demeanor', 'Deep pedagogical patience', 'Family-centric values', 'Quiet wisdom'],
      },
    },
  },

  // 20. Yann LeCun
  yannlecun: {
    name: 'Yann LeCun',
    linkedinUsername: 'yann-lecun',
    instagramUsername: 'yannlecun',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'VP & Chief AI Scientist at Meta, Silver Professor at NYU (Turing Laureate)',
    linkedin: {
      rawExcerpt: 'ACM Turing Award Laureate (2018), Chief AI Scientist at Meta, Silver Professor of Computer Science at NYU Courant Institute. Pioneer of Convolutional Neural Networks and World Models.',
      fields: {
        headline: 'Chief AI Scientist at Meta | Silver Professor at NYU | Turing Award Laureate',
        bio: 'Autonomous Machine Intelligence, World Models, Joint Embedding Architectures.',
        summary: 'Pioneer of deep learning, computer vision, and machine learning architectures. Passionate about open source research, jazz wind instruments, French gastronomy, and sailing.',
        recentTopics: ['World Models & JEPA', 'Open Science', 'French Gastronomy & Wine', 'Sailing & Windsurfing'],
        publicTags: ['Deep Learning', 'Open Science', 'French Cuisine', 'Sailing'],
        experienceHighlights: ['Chief AI Scientist Meta (2013-present)', 'Silver Professor NYU', 'Turing Award Laureate 2018'],
        locationHint: 'New York, NY',
      },
    },
    instagram: {
      rawExcerpt: 'Sailing along Long Island Sound, wine tasting in Bordeaux, playing jazz flute, artisanal French pastries, and campus lectures.',
      fields: {
        bio: 'Scientist, NYU professor, jazz lover, sailor.',
        recentTopics: ['Sailing regattas on sunny weekends', 'Playing French jazz flute', 'Artisanal sourdough and baguettes', 'Fine Burgundy wine pairings'],
        publicTags: ['Sailing', 'Jazz Flute', 'French Wine', 'Gastronomy'],
        contentSignals: ['Sophisticated bon vivant', 'Loves intellectual debates', 'Enjoys seaside outdoors', 'Appreciates culinary artistry'],
      },
    },
  },

  // 21. Linus Sebastian (Linus Tech Tips)
  linustechtips: {
    name: 'Linus Sebastian',
    linkedinUsername: 'linus-sebastian',
    instagramUsername: 'linustech',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder at Linus Media Group & Tech Entertainer',
    linkedin: {
      rawExcerpt: 'Founder and former CEO of Linus Media Group. Overseeing YouTube channels with over 15 million subscribers specializing in PC hardware, enterprise networking, and consumer electronics.',
      fields: {
        headline: 'Founder & Chief Vision Officer at Linus Media Group',
        bio: 'Entertaining and educating audiences about computer hardware and tech.',
        summary: 'Built one of the largest independent technology testing laboratories (LTT Labs). Passionate about transparent consumer advocacy, DIY home automation, and bad puns.',
        recentTopics: ['PC Hardware Engineering', 'Home Automation & Smart Homes', 'LTT Labs Testing', 'Badminton & Outdoor Sports'],
        publicTags: ['PC Hardware', 'Home Automation', 'Consumer Advocacy', 'Badminton'],
        experienceHighlights: ['Founder Linus Media Group (2013-present)', 'Creator Linus Tech Tips'],
        locationHint: 'Surrey, BC, Canada',
      },
    },
    instagram: {
      rawExcerpt: 'Socks with sandals, dropping graphics cards, whole-home pool automation pipe systems, badminton matches, and family camping trips in BC.',
      fields: {
        bio: 'Tech enthusiast, father, badminton player, professional equipment dropper.',
        recentTopics: ['Competitive badminton rallies', 'Pacific Northwest camping and campfires', 'Home network rack cabling', 'Socks with sandals fashion'],
        publicTags: ['Badminton', 'Camping', 'Home Server', 'Dad Jokes'],
        contentSignals: ['Self-deprecating humor', 'High energy', 'Family man', 'Enjoys active weekend sports'],
      },
    },
  },

  // 22. Jensen Huang
  jensenhuang: {
    name: 'Jensen Huang',
    linkedinUsername: 'jensen-huang-nvidia',
    instagramUsername: 'jensenhuangnvidia',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Founder and CEO at NVIDIA',
    linkedin: {
      rawExcerpt: 'Co-founder, President, and CEO of NVIDIA. Pioneering accelerated computing, GPU architecture, CUDA ecosystem, and robotics simulation platforms.',
      fields: {
        headline: 'President and CEO at NVIDIA',
        bio: 'Accelerated computing, generative AI platforms, Omniverse, robotics.',
        summary: 'Oregon State and Stanford graduate. Led NVIDIA from 3D graphics for video games into the engine of modern AI, high-performance computing, and autonomous physical machines.',
        recentTopics: ['Accelerated Computing', 'Physical AI & Robotics', 'Blackwell GPU Architectures', 'Table Tennis & Cooking'],
        publicTags: ['Accelerated Computing', 'Robotics', 'Table Tennis', 'Culinary Cooking'],
        experienceHighlights: ['CEO and Co-founder at NVIDIA (1993-present)', 'Microprocessor Designer at AMD'],
        locationHint: 'Santa Clara, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Leather jacket collections, fast table tennis rallies, family teppanyaki dinners in Taipei night markets, and robotics lab tours.',
      fields: {
        bio: 'Engineer, CEO, table tennis enthusiast, night market foodie.',
        recentTopics: ['Table tennis drills', 'Night market stinky tofu and dumplings', 'Culinary wok cooking at home', 'Iconic leather jacket styles'],
        publicTags: ['Table Tennis', 'Night Markets', 'Wok Cooking', 'Leather Jackets'],
        contentSignals: ['Passionate and intense', 'Loves street food and cooking', 'Enjoys lightning-fast table tennis', 'Generous host'],
      },
    },
  },

  // 23. Bret Victor
  bretvictor: {
    name: 'Bret Victor',
    linkedinUsername: 'bretvictor',
    instagramUsername: 'worrydream',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'Interface Designer & Director at Dynamicland',
    linkedin: {
      rawExcerpt: 'Interface designer, researcher, and Director of Dynamicland (CDG Research). Known for seminal essays Inventing on Principle, Media for Thinking the Unthinkable, and Humane Computing.',
      fields: {
        headline: 'Director at Dynamicland | Human-Computer Interaction Researcher',
        bio: 'Designing tangible media for thinking the unthinkable and collaborative physical computing.',
        summary: 'Caltech and UC Berkeley alum. Former Human Interface designer at Apple. Pioneering non-screen computational mediums, spatial paper computers, and scientific visualization.',
        recentTopics: ['Dynamic Media', 'Inventing on Principle', 'Physical Collaborative Computing', 'Graphic Novels & Visual Storytelling'],
        publicTags: ['HCI Design', 'Dynamicland', 'Typography', 'Visual Math'],
        experienceHighlights: ['Director at Dynamicland / CDG (2014-present)', 'Human Interface Designer at Apple'],
        locationHint: 'Oakland, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Paper computing programs illuminated by overhead projectors, vintage comic book prints, antique drafting rulers, and botanical sketches.',
      fields: {
        bio: 'Dynamicland. Paper, light, physical media, understanding systems.',
        recentTopics: ['Paper computing experiments', 'Hand-drawn mathematical proofs', 'Vintage comic book layouts', 'Walking quiet oak groves'],
        publicTags: ['Visual Thinking', 'Comics', 'Drafting', 'Paper Media'],
        contentSignals: ['Deeply creative visionary', 'Philosophical and quiet', 'Loves museum and gallery visits', 'Values authentic human presence'],
      },
    },
  },

  // 24. Sam Altman
  samaltman: {
    name: 'Sam Altman',
    linkedinUsername: 'samaltman',
    instagramUsername: 'sama',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'CEO at OpenAI & Tech Investor',
    linkedin: {
      rawExcerpt: 'CEO of OpenAI, former President of Y Combinator, investor in nuclear fusion (Helion), life extension (Retro Biosciences), and global frontier computing.',
      fields: {
        headline: 'CEO at OpenAI | Clean Energy & Frontier Tech Investor',
        bio: 'Building artificial general intelligence that benefits all of humanity.',
        summary: 'Stanford CS dropout who founded Loopt at 19, served as President of Y Combinator, and co-founded OpenAI. Focused on safe deployment of frontier models, energy abundance, and meditation.',
        recentTopics: ['AGI & Model Architectures', 'Nuclear Fusion & Clean Energy', 'High-Speed Rail', 'Meditation & Hiking'],
        publicTags: ['Generative AI', 'Clean Energy', 'Venture Capital', 'Meditation'],
        experienceHighlights: ['CEO at OpenAI (2019-present)', 'President at Y Combinator (2014-2019)', 'Founder Loopt'],
        locationHint: 'San Francisco, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Ranch walks in Big Sur, classic race cars, hiking trails with dogs, espresso and notebooks, and solar array blueprints.',
      fields: {
        bio: 'Curious about the future, energy, nature, and stillness.',
        recentTopics: ['Big Sur coastal hikes', 'Vintage racing car restoration', 'Silent meditation retreats', 'Espresso on the deck'],
        publicTags: ['Big Sur Hikes', 'Classic Cars', 'Meditation', 'Coffee'],
        contentSignals: ['Quiet introspection', 'Appreciates nature escapes', 'Driven by big ideas', 'High stamina'],
      },
    },
  },

  // 25. Tim Cook
  timcook: {
    name: 'Tim Cook',
    linkedinUsername: 'tim-cook',
    instagramUsername: 'timcook',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bioHeadline: 'CEO at Apple',
    linkedin: {
      rawExcerpt: 'CEO of Apple. Champion of human rights, environmental stewardship, accessible technology, and user privacy. Overseeing global design, silicon engineering, and services.',
      fields: {
        headline: 'CEO at Apple',
        bio: 'Leading Apple with values of privacy, environmental responsibility, and inclusion.',
        summary: 'Auburn and Duke graduate with deep background in global supply chain logistics, operations, and values-led corporate leadership. Passionate about national parks and fitness.',
        recentTopics: ['Clean Energy & Carbon Neutrality', 'User Privacy as Fundamental Right', 'National Parks Conservation', 'Early Morning Cycling'],
        publicTags: ['Privacy', 'Conservation', 'Cycling', 'Supply Chain'],
        experienceHighlights: ['CEO at Apple (2011-present)', 'Chief Operating Officer at Apple (1998-2011)', 'Compaq / IBM'],
        locationHint: 'Cupertino, CA',
      },
    },
    instagram: {
      rawExcerpt: 'Dawn cycling rides, Yosemite and Zion National Park vistas, Apple Park glass reflections, and college football Saturdays.',
      fields: {
        bio: 'CEO Apple. Auburn football fan. Nature lover. Fitness enthusiast.',
        recentTopics: ['National Park hiking trails', 'Pre-dawn cycling workouts', 'Auburn Tigers football games', 'Renewable energy solar farms'],
        publicTags: ['National Parks', 'Cycling', 'College Football', 'Nature'],
        contentSignals: ['Early morning riser', 'Disciplined fitness routine', 'Passionate about conservation', 'Thoughtful listener'],
      },
    },
  },
};
