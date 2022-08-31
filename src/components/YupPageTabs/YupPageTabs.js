import { Tab, Tabs } from '@mui/material';
import { TabsContainer } from './styles';

function YupPageTabs({ tabs, value, onChange, endComponent, hidden }) {
  return (
    <TabsContainer
      sx={{
        display: hidden ? 'none' : endComponent ? 'flex' : 'block',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Tabs
        onChange={(event, newValue) => onChange(newValue, event)}
        value={value}
        scrollButtons="auto"
        variant="scrollable"
      >
        {tabs.map(({ label, value }) => (
          <Tab key={value} label={label} value={value} />
        ))}
      </Tabs>
      {endComponent}
    </TabsContainer>
  );
}

export default YupPageTabs;
