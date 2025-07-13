import { Formio } from '@formio/js';

const defaultTemplate = {
  spinner: 'Loading...',
  type: 'bootstrap3',
  framework: 'bootstrap3'
};

// Initialize template on import to ensure it's set before any Form components are rendered
Formio.setTemplate(defaultTemplate);

export { defaultTemplate };
