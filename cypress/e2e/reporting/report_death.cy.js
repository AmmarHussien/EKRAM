/// <reference types="cypress" />


describe('Reporting Death', () => {

    before('login ', () => {

        const filePath = 'cypress/fixtures/case/cases.json';
        const filePath2 = 'cypress/fixtures/case/report.json'

        cy.readFile(filePath2).then((readData) => {
            cy.readFile(filePath) // Read the existing file
                .then((existingData) => {
                    // Modify the existing data or completely replace it
                    const newData = {
                        ...existingData,
                        IdentificationTypeForRelation: readData.IdentificationTypeRelation,
                        relate: readData.relate,
                        relationType: readData.relationType,
                        IdentificationTypeForCase: readData.IdentificationTypeCase,
                        Nationality: readData.nationality,
                        religion: readData.religion,
                        gender: readData.gender
                    };

                    cy.wrap(null) // Create a chain to continue the sequence
                        .then(() => {
                            // Write the modified data back to the same file
                            cy.writeFile(filePath, newData);
                        })
                        .then(() => {
                            cy.log('Data overwritten in JSON file successfully');
                        })
                })
        })
        
        cy.visit('https://ekram-md.org/service-catalog')

        cy.get('.identity').click()

        cy.fixture('login_data/users.json').then((user) => {
            if (user) {
                cy.get('#username').type(user.username || ''); // Using empty string as fallback
                cy.get('#password').type(user.password || ''); // Using empty string as fallback
            } else {
                // Handle the case where the file couldn't be read or is empty
                // For example, log an error
                cy.log('Error: Unable to read user data from file');
            }
        });
        cy.get('#kc-login').click()
       // cy.get('#kc-form-login-simple > #kc-form-buttons > #kc-login').click()

    })
    it('Report', () => {

        cy.get('.app-service-card-list .app-service-card .col-auto .ng-star-inserted').eq(0).click()

        cy.get('.services-categorey-accordion .card-body .accordion-widget').eq(0).click()

        cy.wait(3000)

        cy.get('.btn').click()

        cy.wait(3000)

        cy.fixture('case/cases.json').then((cases) => {
            cy.fixture('case/report.json').then((reports) => {

                const selectIdentificationRelation = reports.IdentificationTypeRelation;

                if (cases.IdentificationTypeForRelation == 'Citizen' || cases.IdentificationTypeForRelation == 'Resident') {

                    cy.get(".form-check-input").eq(cases.IdentificationRelation[selectIdentificationRelation].choice).click({
                        force: true
                    })
                    cy.get('#idNumber').type(`${reports.idNumber}`)

                    cy.get('.input-group > .input').eq(0).type(`${reports.birthDate}{enter}`)

                    cy.get('#nafathSync').click()

                    if (cases.relate == 'no') {

                        cy.get(".form-check-input").eq(10).should("have.value", 'no').click({
                            force: true
                        })

                    } else {
                        cy.get(".form-check-input").eq(9).click()

                        cy.get("div.form-control").eq(6).click().then(() => {

                            const selectedRelation = reports.relationType;

                            if (reports.relationType != 'other') {

                                cy.get(`#choices--reporterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                            } else {

                                cy.log(selectedRelation);

                                cy.get(`#choices--reporterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                                cy.get('#reporterActualRelation').type(reports.otherRelation)
                            }

                        })
                    }

                } else if (cases.IdentificationTypeForRelation == 'Visitor' || cases.IdentificationTypeForRelation == 'Umrah' || cases.IdentificationTypeForRelation == 'Haj') {

                    cy.get(".form-check-input").eq(cases.IdentificationRelation[selectIdentificationRelation].choice).click({
                        force: true
                    })
                    cy.wait(2000)

                    if (reports.VisitorIdentificationTypeRelation == 'Passport') {
                        cy.get(".form-check-input").eq(8).click({
                            force: true
                        })
                        cy.get('#passportNumber').type(`${reports.idNumberRelation}`)
                    } else {
                        cy.get(".form-check-input").eq(9).click({
                            force: true
                        })
                        cy.get('#borderNumber').type(`${reports.idNumberRelation}`)
                    }

                    cy.get('.choices > div.form-control').eq(3).click().then(() => {
                        cy.get('.choices > .choices__list--dropdown > .choices__input').eq(3).type(`${reports.nationalityRelation} {enter}`)
                    })

                    cy.get('.input-group > .input').eq(0).type(`${reports.birthDateRelation}{enter}`)

                    cy.get('#issuingPlace').type(`${reports.issuingPlaceRelation}`)

                    if (cases.IdentificationTypeRelation == 'Visitor') {

                        cy.get('.choices > div.form-control').eq(6).click().then(() => {
                            cy.wait(1000)
                            const selectedreligion = reports.religion;
                            cy.get(`#choices--religionList-item-choice-${cases.religionList[selectedreligion].choice}`).click({ force: true })
                        })

                    }
                    cy.get('#name').type(reports.nameRelation)

                    cy.get('.input-group > .input').eq(1).type(`${reports.IdentificationExpireDateRelation}{enter}`)

                    cy.get('.choices > div.form-control').eq(5).click().then(() => {
                        cy.wait(1000)
                        const selectedgender = reports.genderRelation;
                        cy.get(`.choices > .choices__list--dropdown > .choices__list > #choices--gender-item-choice-${cases.genderList[selectedgender].choice}`).eq(1).click({ force: true })
                    })

                    if (cases.relate == 'no') {
                        cy.get(".form-check-input").eq(11).should("have.value", 'no').click({
                            force: true
                        })
                    } else {
                        cy.get(".form-check-input").eq(10).click()

                        cy.get("div.form-control").eq(6).click().then(() => {
                            const selectedRelation = reports.relationType;
                            if (reports.relationType != 'other') {

                                cy.get(`#choices--reporterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                            } else {

                                cy.log(selectedRelation);

                                cy.get(`#choices--reporterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                                cy.get('#reporterActualRelation').type(reports.otherRelation)
                            }

                        })
                    }
                }
                
                // cy.get('.formio-component-reporterMobileNumber').should('have.class', 'required')
                // cy.get('#reporterMobileNumber').should('have.attr', 'required').type(reports.reporterNumber)

                cy.get('#reporterMobileNumber').type(reports.reporterNumber)

                const selectIdentificationCase = reports.IdentificationTypeCase;

                if (cases.IdentificationTypeForCase == 'Citizen' || cases.IdentificationTypeForCase == 'Resident') {


                    if (cases.IdentificationTypeForRelation == 'Citizen' || cases.IdentificationTypeForRelation == 'Resident') {

                        cy.get(".form-check-input").eq(cases.IdentificationCase[selectIdentificationCase].choice).click({
                            force: true
                        })
                        cy.get('.card-body #idNumber').eq(1).type(`${reports.idNumber}`)

                        cy.get('.input-group > .input').eq(1).type(`${reports.birthDate}{enter}`)

                        cy.get('.card-body #nafathSync').eq(1).click()

                        cy.get('.input-group > .input').eq(3).click().clear().type(`${reports.IncidentDateandTime} {enter}`, { force: true })



                    } else {
                        cy.get(".form-check-input").eq(cases.IdentificationCase[selectIdentificationCase].choice + 1).click({
                            force: true
                        })
                        cy.get('#idNumber').type(`${reports.idNumber}`)

                        cy.get('.input-group > .input').eq(2).type(`${reports.birthDate}{enter}`)

                        cy.get('#nafathSync').click()

                        cy.get('.input-group > .input').eq(4).click().clear().type(`${reports.IncidentDateandTime} {enter}`, { force: true })

                    }


                } else if (cases.IdentificationTypeForCase == 'Visitor' || cases.IdentificationTypeForCase == 'Umrah' || cases.IdentificationTypeForCase == 'Haj') {


                    if (cases.IdentificationTypeForRelation == 'Citizen' || cases.IdentificationTypeForRelation == 'Resident') {


                        cy.get(".form-check-input").eq(cases.IdentificationCase[selectIdentificationCase].choice).click({
                            force: true
                        })
                        cy.wait(2000)
    
                        if (reports.VisitorIdentificationTypeRelation == 'Passport') {
                            cy.get(".form-check-input").eq(19).click({
                                force: true
                            })
    
                        } else {
                            cy.get(".form-check-input").eq(20).click({
                                force: true
                            })
                        }
    
                        ///////////////////////////////////////////////////////////////
    
                        cy.get('#passportNumber').type(`${reports.idNumber}`, { force: true })

                        cy.get('.input-group > .input').eq(2).type(`${reports.IdentificationExpireDate}{enter}`)

                        cy.get('.input-group > .input').eq(4).click().clear().type(`${reports.IncidentDateandTime} {enter}`, { force: true })

                       

                    } else {
                        cy.get(".form-check-input").eq(cases.IdentificationCase[selectIdentificationCase].choice+1).click({
                            force: true
                        })
                        cy.wait(2000)
    
                        if (reports.VisitorIdentificationTypeRelation == 'Passport') {
                            cy.get(".form-check-input").eq(20).click({
                                force: true
                            })
    
                        } else {
                            cy.get(".form-check-input").eq(21).click({
                                force: true
                            })
                        }

                        cy.get('.card-body #passportNumber').eq(1).type(`${reports.idNumber}`, { force: true })

                        cy.get('.input-group > .input').eq(3).type(`${reports.IdentificationExpireDate}{enter}`)

                        cy.get('.input-group > .input').eq(5).click().clear().type(`${reports.IncidentDateandTime} {enter}`, { force: true })

                    }


                    cy.get('.choices > div.form-control').eq(9).click().then(() => {
                        cy.get('.choices > .choices__list--dropdown > .choices__input').eq(9).type(`${reports.nationality} {enter}`)
                    })

                    cy.get('.input-group > .input').eq(2).type(`${reports.birthDate}{enter}`)

                    ///////////////////////////////////////////////////////////////

                    cy.get('.card-body #issuingPlace').eq(1).type(`${reports.issuingPlace}`)

                    if (cases.IdentificationType == 'Visitor') {

                        cy.get('.choices > div.form-control').eq(10).click().then(() => {
                            cy.wait(1000)
                            const selectedreligion = reports.religion;
                            cy.get(`#choices--religionList-item-choice-${cases.religionList[selectedreligion].choice}`).click({ force: true })
                        })

                    }

                    cy.get('.card-body #name').eq(1).type(reports.name)
                  

                    cy.get('.choices > div.form-control').eq(11).click().then(() => {
                        cy.wait(1000)
                        const selectedgender = reports.gender;
                        cy.get(`.choices > .choices__list--dropdown > .choices__list > #choices--gender-item-choice-${cases.genderList[selectedgender].choice}`).eq(2).click({ force: true })
                    })
                }


                cy.get('.choices > div.form-control').eq(12).click().then(() => {
                    cy.get('.choices > .choices__list--dropdown > .choices__input').eq(12).type(`${reports.reportingDistrict} {enter}`)
                })

                cy.wait(2000)

                cy.get('.choices > div.form-control').eq(13).click().then(() => {
                    cy.get('.choices > .choices__list--dropdown > .choices__input').eq(13).type(`${reports.city} {enter}`, { force: true })
                })

                cy.get('#map-search').type(reports.locationInMap)

                cy.get(':nth-child(1) > .pac-item-query > .pac-matched').click()


                cy.get('#notes').type(reports.notes)

            })
            //cy.get('#submit').click()
        })
    })
})