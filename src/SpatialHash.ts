// https://github.com/simondevyoutube/Tutorial_SpatialHashGrid_Optimized

type Cell = {
  min?: [number, number]
  max?: [number, number]
  nodes?: Cell[][]
  next?: Cell
  prev?: Cell
  client?: Client
}

export type Client = {
  position: [number, number]
  dimensions: [number, number]
  cells: Cell
  queryId: number
  value: any
}

export class SpatialHash {
  private cells: (Cell | undefined)[][]
  private bounds: [[number, number], [number, number]]
  private dimensions: [number, number]
  private queryIds: number

  constructor(
    bounds: [[number, number], [number, number]],
    dimensions: [number, number]
  ) {
    const [x, y] = dimensions
    this.cells = [...Array(x)].map((_) => [...Array(y)])
    this.dimensions = dimensions
    this.bounds = bounds
    this.queryIds = 0
  }

  private getCellIndex(position: [number, number]): [number, number] {
    const x = sat(
      (position[0] - this.bounds[0][0]) /
        (this.bounds[1][0] - this.bounds[0][0])
    )
    const y = sat(
      (position[1] - this.bounds[0][1]) /
        (this.bounds[1][1] - this.bounds[0][1])
    )

    const xIndex = Math.floor(x * (this.dimensions[0] - 1))
    const yIndex = Math.floor(y * (this.dimensions[1] - 1))

    return [xIndex, yIndex]
  }

  newClient(
    position: [number, number],
    dimensions: [number, number],
    value: any
  ) {
    const client = {
      position: position,
      dimensions: dimensions,
      cells: {},
      queryId: -1,
      value,
    }

    this.insert(client)

    return client
  }

  updateClient(client: Client) {
    const [x, y] = client.position
    const [w, h] = client.dimensions

    const i1 = this.getCellIndex([x - w / 2, y - h / 2])
    const i2 = this.getCellIndex([x + w / 2, y + h / 2])

    if (
      client.cells.min![0] == i1[0] &&
      client.cells.min![1] == i1[1] &&
      client.cells.max![0] == i2[0] &&
      client.cells.max![1] == i2[1]
    ) {
      return
    }

    this.remove(client)
    this.insert(client)
  }

  findNear(position: [number, number], bounds: [number, number], max: number) {
    if (max == 0) return []

    const [x, y] = position
    const [w, h] = bounds

    const i1 = this.getCellIndex([x - w / 2, y - h / 2])
    const i2 = this.getCellIndex([x + w / 2, y + h / 2])

    const res = []
    const queryId = this.queryIds++

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        let head = this.cells[x][y]
        while (head) {
          const v = head.client!
          head = head.next

          if (v.queryId != queryId) {
            v.queryId = queryId
            res.push(v.value)
            if (res.length >= max) return res
          }
        }
      }
    }
    return res
  }

  private insert(client: Client) {
    const [x, y] = client.position
    const [w, h] = client.dimensions

    const i1 = this.getCellIndex([x - w / 2, y - h / 2])
    const i2 = this.getCellIndex([x + w / 2, y + h / 2])

    const nodes: Cell[][] = []

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      nodes.push([])

      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const xi = x - i1[0]

        const head: Cell = {
          client: client,
        }

        nodes[xi].push(head)

        head.next = this.cells[x][y]
        if (this.cells[x][y]) {
          this.cells[x][y]!.prev = head
        }

        this.cells[x][y] = head
      }
    }

    client.cells.min = i1
    client.cells.max = i2
    client.cells.nodes = nodes
  }

  remove(client: Client) {
    const i1 = client.cells.min!
    const i2 = client.cells.max!

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const xi = x - i1[0]
        const yi = y - i1[1]
        const node = client.cells.nodes![xi][yi]

        if (node.next) {
          node.next.prev = node.prev
        }
        if (node.prev) {
          node.prev.next = node.next
        }

        if (!node.prev) {
          this.cells[x][y] = node.next
        }
      }
    }

    client.cells.min = undefined
    client.cells.max = undefined
    client.cells.nodes = undefined
  }
}

function sat(x: number) {
  return Math.min(Math.max(x, 0.0), 1.0)
}
