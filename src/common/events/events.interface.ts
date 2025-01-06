export interface Priority {
  attempts?: number;
  LIFO?: boolean;
  FIFO?: boolean;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
  backoff?: {
    type: 'fixed' | 'not fixed';
    delay: number;
  };
}

export class QueuePriority {
  private static baseLevel(options: Priority): Priority {
    return {
      ...options,
    };
  }

  static level1(): Priority {
    return this.baseLevel({
      attempts: 10,
      LIFO: true,
      FIFO: false,
      removeOnComplete: true,
      removeOnFail: false,
      backoff: {
        type: 'fixed',
        delay: 1000,
      },
    });
  }

  static level2(): Priority {
    return this.baseLevel({
      attempts: 9,
      LIFO: true,
      FIFO: false,
      removeOnComplete: true,
      removeOnFail: false,
      backoff: {
        type: 'fixed',
        delay: 2000,
      },
    });
  }

  static level3(): Priority {
    return this.baseLevel({
      attempts: 8,
      LIFO: true,
      FIFO: false,
      removeOnComplete: true,
      removeOnFail: false,
      backoff: {
        type: 'fixed',
        delay: 3000,
      },
    });
  }

  static level4(): Priority {
    return this.baseLevel({
      attempts: 7,
      LIFO: true,
      FIFO: false,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 4000,
      },
    });
  }

  static level5(): Priority {
    return this.baseLevel({
      attempts: 6,
      LIFO: false,
      FIFO: true,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 5000,
      },
    });
  }

  static level6(dto: Priority): Priority {
    return this.baseLevel({
      attempts: dto.attempts ? dto.attempts : 5,
      LIFO: false,
      FIFO: true,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 6000,
      },
    });
  }

  static level7(): Priority {
    return this.baseLevel({
      attempts: 4,
      LIFO: false,
      FIFO: true,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 7000,
      },
    });
  }

  static level8(): Priority {
    return this.baseLevel({
      attempts: 3,
      LIFO: false,
      FIFO: true,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 8000,
      },
    });
  }

  static level9(): Priority {
    return this.baseLevel({
      attempts: 2,
      LIFO: false,
      FIFO: true,
      removeOnComplete: false,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 9000,
      },
    });
  }

  static level10(): Priority {
    return this.baseLevel({
      attempts: 1,
      LIFO: false,
      FIFO: true,
      removeOnComplete: false,
      removeOnFail: true,
      backoff: {
        type: 'not fixed',
        delay: 10000,
      },
    });
  }
}
