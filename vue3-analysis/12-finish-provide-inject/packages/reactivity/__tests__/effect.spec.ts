import { effect, stop } from "../src/effect";
import { reactive } from "../src/reactive";

/**
 * 测试effect
 */
describe('effect', () => {

  test('effect是接受一个函数，当执行effect的时候，内部的函数会执行', () => {
    const fn = jest.fn();
    effect(fn)
    expect(fn).toBeCalledTimes(1)
  })


  test('effect 有返回值', () => {
    let num = 10;
    // effect有返回值
    const runner = effect(() => {
      num++;
      return 'num'
    })
    // effect 在一开始的时候会调用
    expect(num).toBe(11)

    // 执行runner，并且拿到返回值
    const r = runner()
    // effect内部也会执行
    expect(num).toBe(12)

    // 验证返回值
    expect(r).toBe('num')
  })

  test('scheduler 调度器', () => {
    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  })

  test("stop 停止响应", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);

    obj.prop = 3

    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(4);
  });

  it("events: onStop", () => {
    const onStop = jest.fn();
    const runner = effect(() => {}, {
      onStop,
    });

    stop(runner);
    expect(onStop).toHaveBeenCalled();
  });
})


