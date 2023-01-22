package scratches

import (
	"errors"
	"sync"
)

const queueSize = 10

var ErrQueueClosed = errors.New("queue closed")

type Queue struct {
	Tasks chan Task
	Open  bool
	wg    sync.WaitGroup
	mu    sync.Mutex
}

func NewQueue() *Queue {
	q := &Queue{
		Tasks: make(chan Task, queueSize),
		Open:  true,
		wg:    sync.WaitGroup{},
	}
	q.wg.Add(1)
	return q
}

func (q *Queue) Close() {
	q.mu.Lock()
	q.Open = false
	close(q.Tasks)
	q.mu.Unlock()

	q.wg.Wait()
}

func (q *Queue) PutTask(task Task) error {
	q.mu.Lock()
	defer q.mu.Unlock()

	if !q.Open {
		return ErrQueueClosed
	}

	q.Tasks <- task
	return nil
}

func (q *Queue) GetTask() (Task, bool) {
	task, channelOpen := <-q.Tasks
	if !channelOpen {
		q.wg.Done()
	}

	return task, channelOpen
}
