// cypress/integration/your_test_spec.js

describe('JSON File Overwriting Test', () => {
    it('overwrites data in a JSON file', () => {
      const filePath = 'cypress/fixtures/case/case.json';
  
      cy.readFile(filePath) // Read the existing file
        .then((existingData) => {
          // Modify the existing data or completely replace it
          const newData = { ...existingData, relationType: 'father' };
  
          cy.wrap(null) // Create a chain to continue the sequence
            .then(() => {
              // Write the modified data back to the same file
              cy.writeFile(filePath, newData);
            })
            .then(() => {
              cy.log('Data overwritten in JSON file successfully');
            })
        })
    });
  });
  