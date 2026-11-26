def climb(n):
    choices = [1, 2]
    count = [0]

    def visit(stair):
        if stair == n:
            count[0] += 1
            return
        for move in choices:
            if stair + move > n:
                continue
            visit(stair + move)

    visit(0)
    return count[0]


if __name__ == "__main__":
    print(climb(9))  # 55 routes
