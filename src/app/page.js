import ClientAboutView from "@/components/client-view/about";
import Footer from '@/components/client-view/contact';
import ClientExperienceAndEducationView from "@/components/client-view/experience";
import ClientHomeView from "@/components/client-view/home";
import ClientProjectView from "@/components/client-view/project";


async function extractAllDatas(currentSection) {
  try {
    // Menggunakan URL absolut untuk production atau relatif untuk development
    const baseUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://magetangemawan-robertusdimassenakusumas-projects.vercel.app'
      : 'http://localhost:3000';
        
    const fullUrl = `${baseUrl}/api/${currentSection}/get`;
    console.log(`🔍 Fetching ${currentSection} from:`, fullUrl);
    console.log(`🌍 Environment:`, process.env.NODE_ENV);
    
    const res = await fetch(fullUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response status for ${currentSection}:`, res.status);

    if (!res.ok) {
      console.error(`❌ Failed to fetch ${currentSection}:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log(`📦 Raw response for ${currentSection}:`, data);
    
    // Periksa struktur data - sesuaikan dengan API response Anda
    const processedData = data && data.data ? data.data : data;
    console.log(`✅ Processed data for ${currentSection}:`, processedData);
    
    return processedData;
  } catch (error) {
    console.error(`💥 Error fetching ${currentSection}:`, error);
    return null;
  }
}

export default async function Home() {
  try {
    console.log('🏠 Starting Home component data fetch...');
    
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

    // Log hasil Promise.allSettled
    console.log('📊 Promise results:', {
      home: homeSectionResult,
      about: aboutSectionResult,
      experience: experienceSectionResult,
      education: educationSectionResult,
      project: projectSectionResult
    });

    // Mengambil data dari hasil Promise.allSettled
    const homeSectionData = homeSectionResult.status === 'fulfilled' ? homeSectionResult.value : null;
    const aboutSectionData = aboutSectionResult.status === 'fulfilled' ? aboutSectionResult.value : null;
    const experienceSectionData = experienceSectionResult.status === 'fulfilled' ? experienceSectionResult.value : null;
    const educationSectionData = educationSectionResult.status === 'fulfilled' ? educationSectionResult.value : null;
    const projectSectionData = projectSectionResult.status === 'fulfilled' ? projectSectionResult.value : null;

    // Log final data yang akan dikirim ke components
    console.log('🎯 Final data to components:', {
      home: homeSectionData,
      about: aboutSectionData,
      experience: experienceSectionData,
      education: educationSectionData,
      project: projectSectionData
    });

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
        <Footer />
      </div>
      
    );
  } catch (error) {
    console.error('💥 Error in Home component:', error);
        
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
        <Footer />
      </div>
    );
  }
}