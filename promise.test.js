const DenPromise = require("./promise.js")

describe("Den promise", () => {
  let executorSpy
  let promise

  const successResult = 21
  const errorResult = "I am an error!!!"

  //called before each of tests
  beforeEach(() => {
    executorSpy = jest.fn(resolve => setTimeout(() => resolve(successResult), 150))
    promise = new DenPromise(executorSpy)
  })

  test("Den promise should exist & to be type of function", () => {
    expect(DenPromise).toBeDefined()
    expect(typeof DenPromise).toBe('function')
  })

  test("Instance should have methods: then, catch, finally", () => {
    expect(promise.then).toBeDefined()
    expect(promise.catch).toBeDefined()
    expect(promise.finally).not.toBeUndefined()
  })

  test("should call executor function", () => {
    expect(executorSpy).toHaveBeenCalled()
  })

  test("should get data in then block and chain them", async () => {
    const result = await promise.then(num => num).then(num => num * 2)
    expect(result).toBe(successResult * 2)
  })

  test("It should catch an error", () => {
    const errorExecutor = ((_, reject) => {
      setTimeout(() => {
        reject(errorResult)
      }, 150);
    })
    const errorPromise = new DenPromise(errorExecutor)

    return new Promise(resolve => {
      errorPromise.catch(error => {
        expect(error).toBe(errorResult)
        resolve()
      });
    })
  })

  test("should call finally method if it was called", async () => {
    const finallySpy = jest.fn(() => { })
    await promise.finally(finallySpy)

    expect(finallySpy).toHaveBeenCalled()
  })
})