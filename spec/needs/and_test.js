let And = require("../../lib/needs/and.js")
const FakeTypes = require("../helpers/fake_types.js")

describe("and", function () {

  describe("validate", function () {
    it("throws on emtpy string", function () {
      expect(function () {
        new And("")
      }).toThrowError(And.ValidationError, "data is not valid")
    })

    it("throws on emtpy object", function () {
      expect(function () {
        new And({})
      }).toThrowError(And.ValidationError, "data is not valid")
    })

    it("throws on invalid type", function () {
      expect(function () {
        new And({
          "type": "the-wrong-type",
          "needs": []
        })
      }).toThrowError(And.ValidationError, "data is not valid")
    })

    it("throws on invalid needs", function () {
      expect(function () {
        new And({
          "type": "and",
          "needs": "pete"
        })
      }).toThrowError(And.ValidationError, "data is not valid")
    })

    it("works on empty needs list", function () {
      expect(function () {
        new And({
          "type": "and",
          "needs": []
        })
      }).not.toThrow()
    })

    it("works on valid input", function () {
      expect(function () {
        new And({
          "type": "and",
          "needs": [{
            "type": "always_happy"
          }]
        }, new FakeTypes())
      }).not.toThrow()
    })
  })

  describe("check", function () {
    describe("empty needs list", function () {
      it("returns true", async function () {
        let need = new And({
          "type": "and",
          "needs": []
        }, new FakeTypes())
        
        await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true })
      })

      describe("satisfied needs list", function () {
        it("returns true", async function () {
          let need = new And({
            "type": "and",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_happy" },
              { "type": "always_happy" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())
          
          await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: true })
        })
      })

      describe("single unsatisfied need", function () {
        it("returns false", async function () {
          let need = new And({
            "type": "and",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_sad" },
              { "type": "always_happy" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())

          await expectAsync(need.check()).toBeResolvedTo({ need, satisfied: false })
        })
      })

      describe("single broken need", function () {
        it("returns false", async function () {
          let need = new And({
            "type": "and",
            "needs": [
              { "type": "always_happy" },
              { "type": "always_sad" },
              { "type": "always_broken" },
              { "type": "always_happy" }
            ]
          }, new FakeTypes())
          let brokenNeed = need.needs[2]

          await expectAsync(need.check()).toBeRejectedWith({ need, reason: {
            need: brokenNeed,
            reason: "I'm always broken"
          }})
        })
      })
    })
  })

  describe("info", function () {
    it("is set", function () {
      expect(And.info).toBeDefined()
    })
  })

  describe("name", function () {
    it("is set", function () {
      expect(And.type).toBe("and")
    })
  })
})