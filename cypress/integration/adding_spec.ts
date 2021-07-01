describe("The adding panel", () => {
  it("should be able to create and use cards", () => {
    cy.contains("You're all done for today!");
    cy.get(':nth-child(1) > .MuiInputBase-root > [rows="1"]').type(
      "This is a _test_ **Question**."
    );
    cy.get(':nth-child(2) > .MuiInputBase-root > [rows="1"]').type(
      "**This** is a _test_ **Answer**."
    );
    cy.contains("submit", { matchCase: false }).click();
    cy.contains("Card added");
    cy.contains("This is a test Question.").click();
    cy.contains("This is a test Answer.");
    cy.contains("Got it!").click();
    cy.contains("You're all done for today!");
    cy.contains("Proceed to next day").click().click();
    cy.contains("This is a test Question.");
  });
});
