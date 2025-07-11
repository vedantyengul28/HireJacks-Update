
export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    skills: string[];
    salary: string;
}
  
export const sampleJobs: Job[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        description: 'Join our team to build next-generation web applications. We are looking for a developer with a passion for creating beautiful and functional user interfaces.',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
        salary: '$120,000 - $160,000',
    },
    {
        id: 2,
        title: 'Backend Engineer',
        company: 'Innovate LLC',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'We are seeking a skilled backend engineer to design, develop, and maintain our server-side applications and APIs. Experience with cloud services is a plus.',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
        salary: '$110,000 - $150,000',
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        company: 'Creative Solutions',
        location: 'Austin, TX',
        type: 'Contract',
        description: 'We need a talented UI/UX designer for a 6-month contract to help redesign our mobile application. You will work closely with our product and engineering teams.',
        skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
        salary: '$70 - $90 / hour',
    },
    {
        id: 4,
        title: 'Junior React Developer',
        company: 'WebWorks',
        location: 'Remote',
        type: 'Part-time',
        description: 'An exciting opportunity for a junior developer to grow their skills. You will assist our senior developers in building new features and fixing bugs.',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        salary: '$25 - $35 / hour',
    },
     {
        id: 5,
        title: 'Full-Stack Engineer',
        company: 'DataDriven Inc.',
        location: 'Chicago, IL',
        type: 'Full-time',
        description: 'We are hiring a versatile full-stack engineer to work on both our client-facing applications and our internal data processing pipelines.',
        skills: ['Python', 'Django', 'React', 'GraphQL', 'Kubernetes'],
        salary: '$130,000 - $170,000',
    },
];
