import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import CustomButton from './CustomButton';
import { theme } from '../theme/theme';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = () => {
    if (language === 'en') {
      setLanguage('ar');
    } else {
      setLanguage('en');
    }
  };

  const buttonTitle = language === 'en' ? 'Arabic' : 'English';

  return (
    <View style={styles.container}>
      <CustomButton
        title={buttonTitle}
        onPress={handleLanguageChange}
        type="tertiary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

export default LanguageSelector;
