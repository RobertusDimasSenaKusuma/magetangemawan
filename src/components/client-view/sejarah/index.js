"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import kadesImage from "../../../assets/fotokades.jpg"; // Background image

export default function Sejarah() {
  const [activeTab, setActiveTab] = useState('sambutan');
  const [contentData, setContentData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [isMobile, setIsMobile] = useState(false); // ← ini juga penting

  // Fetch JSON data when component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/profil.json'); // Adjust path based on your project structure
        if (!response.ok) {
          throw new Error('Failed to fetch profil.json');
        }
        const data = await response.json();
        setContentData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // kamu bisa atur breakpoint sesuai keperluan
    };

    checkScreenSize(); // cek saat pertama kali render
    window.addEventListener('resize', checkScreenSize); // update saat resize

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const baseStyles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2.5rem',
      marginBottom: '3rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    },
    title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.5rem 0' },
    subtitle: { fontSize: '1.25rem', color: '#059669', fontWeight: '600', margin: 0 }
  };

  // Render loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render main content once data is loaded
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', 
        color: 'white', 
        padding: '4rem 1rem',
        marginTop: '4rem'
      }}>
        <div style={baseStyles.container}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Profil Desa Sumbersawit
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
            color: '#bbf7d0', 
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Mengenal lebih dekat sejarah, visi misi Desa Sumbersawit
          </p>
        </div>
      </div>
        
      {/* Navigation Tabs */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        position: 'sticky', 
        top: isMobile ? '58px' : '87px',
        zIndex: 10,
         
      }}>
        <div style={baseStyles.container}>
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '0.5rem', 
            justifyContent: 'flex-start', 
            padding: '0.5rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {Object.keys(contentData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '1rem 2rem',
                  border: 'none',
                  backgroundColor: activeTab === key ? '#059669' : 'transparent',
                  color: activeTab === key ? 'white' : '#374151',
                  fontWeight: activeTab === key ? 'bold' : 'normal',
                  cursor: 'pointer',
                  borderRadius: activeTab === key ? '0.5rem 0.5rem 0 0' : '0',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== key) {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== key) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {key === 'sambutan' ? 'Sambutan Kepala Desa' : 
                 key === 'sejarah' ? 'Sejarah Desa' : 'Visi & Misi'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={baseStyles.container}>
        <div style={baseStyles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: '4px',
              height: '4rem',
              background: 'linear-gradient(to bottom, #059669, #047857)',
              borderRadius: '2px'
            }}></div>
            <div>
              <h2 style={{ ...baseStyles.title, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                {contentData[activeTab].title}
              </h2>
              {activeTab !== 'visimisi' && (
                <p style={{ ...baseStyles.subtitle, 
                  fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                  {contentData[activeTab].subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Sambutan Content */}
          {activeTab === 'sambutan' && (
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              marginBottom: '2rem', 
              alignItems: 'flex-start',
              flexDirection: 'column'
            }}
            className="sambutan-container">
              <div style={{ 
                width: '100%', 
                order: 2
              }}>
                <div style={{ 
                  fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                  lineHeight: '1.8', 
                  color: '#374151',
                  textAlign: 'justify',
                  whiteSpace: 'pre-line'
                }}>
                  {contentData[activeTab].content}
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                order: 1
              }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: '1rem',
                  padding: '1rem',
                  textAlign: 'center',
                  border: '2px solid #059669'
                }}>
                  <div style={{
                    width: 'clamp(150px, 20vw, 200px)',
                    height: 'clamp(200px, 25vw, 250px)',
                    borderRadius: '0.5rem',
                    margin: '0 auto 1rem auto',
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    <Image
                      src={kadesImage}
                      alt="Kepala Desa Sumbersawit"
                      width={200}
                      height={250}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <h4 style={{ 
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    margin: '0 0 0.5rem 0' 
                  }}>
                    {contentData[activeTab].signature}
                  </h4>
                  <p style={{ 
                    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', 
                    color: '#059669',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Bapak Sunyoto
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sejarah Content */}
          {activeTab === 'sejarah' && (
            <div>
              {contentData[activeTab].content.map((item, index) => (
                <div key={index}>
                  {item.paragraph ? (
                    <p style={{ 
                      fontSize: 'clamp(0.95rem, 2vw, 1.125rem)', 
                      lineHeight: '1.8', 
                      color: '#374151', 
                      marginBottom: '1.5rem',
                      textAlign: 'justify'
                    }}>
                      {item.paragraph}
                    </p>
                  ) : item.section_title ? (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ 
                        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
                        fontWeight: 'bold', 
                        color: '#111827', 
                        marginBottom: '1rem'
                      }}>
                        {item.section_title}
                      </h3>
                      {item.items.map((subItem, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ 
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
                            fontWeight: '600', 
                            color: '#059669', 
                            marginBottom: '0.5rem'
                          }}>
                            {subItem.title}
                          </h4>
                          <p style={{ 
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                            color: '#374151', 
                            lineHeight: '1.6', 
                            textAlign: 'justify',
                            margin: 0
                          }}>
                            {subItem.content}
                          </p>
                        </div>
                      ))}
                      
                      {/* Button Lihat Sejarah Selengkapnya */}
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: '2rem',
                        marginBottom: '1rem'
                      }}>
                        <a 
                          href="https://sumbersawit.magetan.go.id/portal/desa/sejarah-desa"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#047857';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 15px rgba(5, 150, 105, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(5, 150, 105, 0.3)';
                          }}
                        >
                          📖 Lihat Sejarah Selengkapnya
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              

              {/* Highlights Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ 
                  fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', 
                  fontWeight: 'bold', 
                  color: '#111827', 
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Informasi Tentang Desa Sumbersawit
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {contentData[activeTab].highlights.map((highlight, index) => (
                    <div key={index} style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: `3px solid ${highlight.color}`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)', 
                        marginBottom: '0.5rem' 
                      }}>
                        {highlight.icon}
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                        fontWeight: 'bold', 
                        color: highlight.color,
                        marginBottom: '0.5rem'
                      }}>
                        {highlight.number}
                      </div>
                      <p style={{ 
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                        color: '#374151', 
                        lineHeight: '1.5',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {highlight.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Visi Misi Content */}
          {activeTab === 'visimisi' && (
            <div>
              {/* Visi */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ 
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                  fontWeight: 'bold', 
                  color: '#1e40af', 
                  marginBottom: '1rem' 
                }}>
                  VISI
                </h4>
                <div style={{
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{ 
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                    color: '#1e40af', 
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    margin: 0,
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    "{contentData[activeTab].visi}"
                  </p>
                </div>
              </div>

              {/* Misi */}
              <div>
                <h4 style={{ 
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                  fontWeight: 'bold', 
                  color: '#dc2626', 
                  marginBottom: '1rem' 
                }}>
                  MISI
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {contentData[activeTab].misi.map((item, index) => (
                    <div key={index} style={{
                      backgroundColor: '#fef2f2',
                      borderRadius: '0.5rem',
                      padding: '1.25rem',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}>
                      <div style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <p style={{ 
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                        color: '#374151', 
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Signature for Sambutan */}
          {activeTab === 'sambutan' && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '2rem', 
              paddingTop: '2rem', 
              borderTop: '1px solid #e5e7eb' 
            }}>
              <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: '0.25rem' 
              }}>
                {contentData[activeTab].signature}
              </p>
              <p style={{ 
                fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
                color: '#6b7280', 
                fontStyle: 'italic' 
              }}>
                {contentData[activeTab].position}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Inline Media Query for Responsive Layout */}
      <style jsx>{`
        @media (max-width: 767px) {
          .sambutan-container {
            flex-direction: column !important;
          }
          .sambutan-container > div:nth-child(1) {
            order: 2 !important;
          }
          .sambutan-container > div:nth-child(2) {
            order: 1 !important;
          }
        }
        @media (min-width: 768px) {
          .sambutan-container {
            flex-direction: row !important;
          }
          .sambutan-container > div:nth-child(1) {
            flex: 2 !important;
            min-width: 250px !important;
            order: 1 !important;
          }
          .sambutan-container > div:nth-child(2) {
            flex: 1 !important;
            min-width: 250px !important;
            order: 2 !important;
          }
        }
      `}</style>
    </div>
  );
}