'use client';
import { useState } from 'react';
import styles from './devCardForm.module.css';

export default function DevCardForm({ onDataFetch }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('orange');
  const [selectedLayout, setSelectedLayout] = useState('horizontal');
  const [customColors, setCustomColors] = useState({
    primary: '#ff6b35',
    secondary: '#f56500',
    accent: '#ea580c'
  });
  const gradientDirection = '135deg';

  const themes = [
    {
      id: 'orange',
      name: 'Orange Flame',
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #f56500 50%, #ea580c 100%)',
      color: '#ff6b35'
    },
    {
      id: 'blue',
      name: 'Ocean Blue',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
      color: '#3b82f6'
    },
    {
      id: 'purple',
      name: 'Purple Galaxy',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
      color: '#8b5cf6'
    },
    {
      id: 'green',
      name: 'Forest Green',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      color: '#10b981'
    },
    {
      id: 'custom',
      name: 'Custom',
      gradient: `linear-gradient(${gradientDirection}, ${customColors.primary} 0%, ${customColors.secondary} 50%, ${customColors.accent} 100%)`,
      color: customColors.primary
    }
  ];

  const fetchUserData = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      
      const currentTheme = selectedTheme === 'custom' 
        ? {
            id: 'custom',
            name: 'Custom',
            gradient: `linear-gradient(${gradientDirection}, ${customColors.primary} 0%, ${customColors.secondary} 50%, ${customColors.accent} 100%)`,
            color: customColors.primary
          }
        : themes.find(t => t.id === selectedTheme);
      
      if (onDataFetch) {
        onDataFetch({ ...data, theme: currentTheme, layout: selectedLayout });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchUserData(e);
    }
  };

  const handleColorChange = (colorType, color) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: color
    }));

    if (selectedTheme !== 'custom') {
      setSelectedTheme('custom');
    }
  };

  const getCurrentTheme = () => {
    if (selectedTheme === 'custom') {
      return {
        gradient: `linear-gradient(${gradientDirection}, ${customColors.primary} 0%, ${customColors.secondary} 50%, ${customColors.accent} 100%)`
      };
    }
    return themes.find(t => t.id === selectedTheme);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.formSection}>
          <div>
            <label htmlFor="username" className={styles.label}>
              HackerNews Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your username"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className={styles.label}>
              Choose Theme
            </label>
            <div className={styles.themeSelector}>
              {themes.filter(theme => theme.id !== 'custom').map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`${styles.themeButton} ${selectedTheme === theme.id ? styles.themeButtonActive : ''}`}
                  style={{ background: theme.gradient }}
                  title={theme.name}
                >
                  {selectedTheme === theme.id && (
                    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
              
              {/* Custom Theme Button */}
              <button
                type="button"
                onClick={() => setSelectedTheme('custom')}
                className={`${styles.themeButton} ${styles.customThemeButton} ${selectedTheme === 'custom' ? styles.themeButtonActive : ''}`}
                style={{ 
                  background: `linear-gradient(${gradientDirection}, ${customColors.primary} 0%, ${customColors.secondary} 50%, ${customColors.accent} 100%)` 
                }}
                title="Custom Theme"
              >
                {selectedTheme === 'custom' ? (
                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className={styles.customIcon} viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9l-5.45 5.19L17.82 22L12 18.77L6.18 22l1.27-7.81L2 9l6.91-.74L12 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className={styles.label}>
              Card Layout
            </label>
            <div className={styles.layoutSelector}>
              <button
                type="button"
                onClick={() => setSelectedLayout('horizontal')}
                className={`${styles.layoutButton} ${selectedLayout === 'horizontal' ? styles.layoutButtonActive : ''}`}
                title="Horizontal Layout"
              >
                <svg className={styles.layoutIcon} viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 5v14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Horizontal
              </button>
              <button
                type="button"
                onClick={() => setSelectedLayout('vertical')}
                className={`${styles.layoutButton} ${selectedLayout === 'vertical' ? styles.layoutButtonActive : ''}`}
                title="Vertical Layout"
              >
                <svg className={styles.layoutIcon} viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 9h14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Vertical
              </button>
            </div>
          </div>

          {/* Custom Color Picker Section */}
          {selectedTheme === 'custom' && (
            <div className={styles.customColorSection}>
              <label className={styles.label}>
                Custom Colors
              </label>
              
              <div className={styles.colorPickerGrid}>
                <div className={styles.colorPickerItem}>
                  <label className={styles.colorLabel}>Primary</label>
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className={styles.colorInput}
                  />
                </div>
                
                <div className={styles.colorPickerItem}>
                  <label className={styles.colorLabel}>Secondary</label>
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className={styles.colorInput}
                  />
                </div>
                
                <div className={styles.colorPickerItem}>
                  <label className={styles.colorLabel}>Accent</label>
                  <input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className={styles.colorInput}
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className={styles.gradientPreview}>
                <div 
                  className={styles.previewBox}
                  style={{ 
                    background: `linear-gradient(${gradientDirection}, ${customColors.primary} 0%, ${customColors.secondary} 50%, ${customColors.accent} 100%)` 
                  }}
                >
                  <span className={styles.previewText}>Preview</span>
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={fetchUserData}
            disabled={isLoading || !username.trim()}
            className={styles.button}
            style={{ background: getCurrentTheme()?.gradient }}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                Generating...
              </>
            ) : (
              <>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
                  <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate DevCard
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}