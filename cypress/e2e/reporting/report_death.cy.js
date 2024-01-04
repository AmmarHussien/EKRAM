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
                        relate: readData.relate,
                        relationType: readData.relationType,
                        IdentificationType: readData.IdentificationType,
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

        cy.get('#kc-form-login-simple > #kc-form-buttons > #kc-login').click()

    })
    it('Report', () => {

        cy.get('.app-service-card-list .app-service-card .col-auto .ng-star-inserted').eq(0).click()

        cy.get('.services-categorey-accordion .card-body .accordion-widget').eq(0).click()

        cy.wait(3000)

        cy.get('.btn').click()

        cy.wait(3000)

        cy.fixture('case/cases.json').then((cases) => {
            cy.fixture('case/report.json').then((reports) => {

                if (cases.relate == 'no') {
                    cy.get(".form-check-input").eq(11).should("have.value", 'no').click({
                        force: true
                    })
                } else {
                    cy.get(".form-check-input").eq(10).click()

                    cy.get("div.form-control").eq(3).click().then(() => {
                        const selectedRelation = reports.relationType;
                        if (reports.relationType != 'other') {

                            cy.get(`#choices--requesterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                        } else {

                            cy.log(selectedRelation);

                            cy.get(`#choices--requesterRelation-item-choice-${cases.relations[selectedRelation].choice}`).click({ force: true });

                            cy.get('#requesterActualRelation').type(cases.relations.other.relation)
                        }
                        // else if (cases.relationType == 'mother') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.mother.choice}`).click({ force: true });

                        // }// else if (cases.relationType == 'son') {

                        // //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.son.choice}`).click({ force: true });

                        // // }
                        //  else if (cases.relationType == 'daughter') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.daughter.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'brother') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.brother.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'sister') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.sister.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'wife') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.wife.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'husband') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.husband.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'friend') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.friend.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'Workfriend') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.Workfriend.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'sponsor') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.sponsor.choice}`).click({ force: true });

                        // } else if (cases.relationType == 'other') {

                        //     cy.get(`#choices--requesterRelation-item-choice-${cases.relations.other.choice}`).click({ force: true });

                        //     cy.get('#requesterActualRelation').type(cases.relations.other.relation)
                        // }

                    })
                }

                const selectIdentification = reports.IdentificationType;

                if (cases.IdentificationType == 'Citizen' || cases.IdentificationType == 'Resident') {

                    cy.get(".form-check-input").eq(cases.Identification[selectIdentification].choice).click({
                        force: true
                    })
                    cy.get('#idNumber').type(`${reports.idNumber}`)

                    cy.get('.input-group > .input').eq(0).type(`${reports.birthDate}{enter}`)

                    cy.get('#nafathSync').click()

                } else if (cases.IdentificationType == 'Visitor' || cases.IdentificationType == 'Umrah' || cases.IdentificationType == 'Haj') {

                    cy.get(".form-check-input").eq(cases.Identification[selectIdentification].choice).click({
                        force: true
                    })
                    cy.wait(2000)

                    if (reports.VisitorIdentificationType == 'Passport') {
                        cy.get(".form-check-input").eq(17).click({
                            force: true
                        })
                    } else {
                        cy.get(".form-check-input").eq(18).click({
                            force: true
                        })
                    }

                    cy.get('#passportNumber').type(`${reports.idNumber}`)

                    cy.get('.choices > div.form-control').eq(5).click().then(() => {
                        cy.get('.choices > .choices__list--dropdown > .choices__input').eq(5).type(`${reports.nationality} {enter}`)
                    })

                    cy.get('.input-group > .input').eq(0).type(`${reports.birthDate}{enter}`)

                    cy.get('#issuingPlace').type(`${reports.issuingPlace}`)

                    if (cases.IdentificationType == 'Visitor') {

                        cy.get('.choices > div.form-control').eq(6).click().then(() => {
                            cy.wait(1000)
                            const selectedreligion = reports.religion;
                            cy.get(`#choices--religionList-item-choice-${cases.religionList[selectedreligion].choice}`).click({ force: true })
                        })

                    }

                    cy.get('#name').type(reports.name)

                    cy.get('.input-group > .input').eq(1).type(`${reports.IdentificationExpireDate}{enter}`)

                    cy.get('.choices > div.form-control').eq(7).click().then(() => {
                        cy.wait(1000)
                        const selectedgender = reports.gender;
                        cy.get(`.choices > .choices__list--dropdown > .choices__list > #choices--gender-item-choice-${cases.genderList[selectedgender].choice}`).eq(1).click({ force: true })
                    })
                }
                cy.get('.input-group > .input').eq(3).click().clear().type(`${reports.IncidentDateandTime}{enter}`, { force: true })

                cy.get('.choices > div.form-control').eq(8).click().then(() => {
                    cy.get('.choices > .choices__list--dropdown > .choices__input').eq(8).type(`${reports.reportingDistrict} {enter}`)
                })
                
                cy.wait(2000)

                cy.get('.choices > div.form-control').eq(9).click().then(() => {
                    cy.get('.choices > .choices__list--dropdown > .choices__input').eq(9).type(`${reports.city} {enter}`)
                })

                cy.get('#requesterMobileNumber').type(reports.requesterMobileNumber)

                cy.get('#map-search').type(reports.locationInMap)

                cy.get(':nth-child(1) > .pac-item-query > .pac-matched').click()

                cy.get(".form-check-input").eq(19).click()

                cy.get(".form-check-input").eq(20).click()

                cy.get('#notes').type(reports.notes)

            })


            //cy.get('#submit').click()
        })
    })
})