import ClientAboutView from "@/components/client-view/about";
import ClientContactView from "@/components/client-view/contact";
import ClientExperienceAndEducationView from "@/components/client-view/experience";
import ClientHomeView from "@/components/client-view/home";
import ClientProjectView from "@/components/client-view/project";

async function extractAllDatas(currentSection) {
  try {
    // Menggunakan URL absolut untuk production atau relatif untuk development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://sumbersawitmagetan.vercel.app'
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/${currentSection}/get`, {
      method: "GET",
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${currentSection}:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data && data.data;
  } catch (error) {
    console.error(`Error fetching ${currentSection}:`, error);
    return null;
  }
}

export default async function Home() {
  try {
    // Menggunakan Promise.allSettled untuk menghindari error jika salah satu API gagal
    const [
      homeSectionResult,
      aboutSectionResult,
      experienceSectionResult,
      educationSectionResult,
      projectSectionResult
    ] = await Promise.allSettled([
      extractAllDatas("home"),
      extractAllDatas("about"),
      extractAllDatas("experience"),
      extractAllDatas("education"),
      extractAllDatas("project")
    ]);

    // Mengambil data dari hasil Promise.allSettled
    const homeSectionData = homeSectionResult.status === 'fulfilled' ? homeSectionResult.value : null;
    const aboutSectionData = aboutSectionResult.status === 'fulfilled' ? aboutSectionResult.value : null;
    const experienceSectionData = experienceSectionResult.status === 'fulfilled' ? experienceSectionResult.value : null;
    const educationSectionData = educationSectionResult.status === 'fulfilled' ? educationSectionResult.value : null;
    const projectSectionData = projectSectionResult.status === 'fulfilled' ? projectSectionResult.value : null;

    return (
      <div>
        <ClientHomeView data={homeSectionData || []} />
        <ClientAboutView
          data={
            aboutSectionData && aboutSectionData.length ? aboutSectionData[0] : {}
          }
        />
        <ClientExperienceAndEducationView
          educationData={educationSectionData || []}
          experienceData={experienceSectionData || []}
        />
        <ClientProjectView data={projectSectionData || []} />
        <ClientContactView />
      </div>
    );
  } catch (error) {
    console.error('Error in Home component:', error);
    
    // Fallback UI jika terjadi error
    return (
      <div>
        <ClientHomeView data={[]} />
        <ClientAboutView data={{}} />
        <ClientExperienceAndEducationView
          educationData={[]}
          experienceData={[]}
        />
        <ClientProjectView data={[]} />
        <ClientContactView />
      </div>
    );
  }
}