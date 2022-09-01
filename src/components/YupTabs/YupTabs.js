import { Tab, Tabs } from '@mui/material';

function YupTabs({ tabs, value, onChange }) {
  return (
    <Tabs
      onChange={(event, newValue) => onChange(newValue, event)}
      value={value}
    >
      {tabs.map(({ label, value }) => (
        <Tab key={value} label={label} value={value} />
      ))}
    </Tabs>
  );
}

export default YupTabs;
