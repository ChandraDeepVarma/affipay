# Component Examples

This directory contains example implementations of various components in the application. These examples demonstrate how to use the components in different contexts and with different configurations.

## Available Examples

### PlanFeaturesExample

Demonstrates how to use the `PlanFeaturesComponent` for managing plan features in the admin panel. This component provides a complete CRUD interface for plan features, including:

- Creating new features
- Editing existing features
- Deleting features
- Searching and filtering features

### PlanFeaturesDisplayExample

Shows how to use the `PlanFeaturesDisplay` component for displaying plan features to end users. This component is designed for use in:

- Pricing pages
- Plan comparison sections
- Feature lists

It only displays active features and can be configured to show which features are included in a specific plan.

## How to Use

To use these examples in your application:

1. Import the example component
2. Add it to your page or layout
3. Customize as needed

Example:

```jsx
import PlanFeaturesExample from '@/components/examples/PlanFeaturesExample';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <PlanFeaturesExample />
    </div>
  );
};

export default AdminPage;
```