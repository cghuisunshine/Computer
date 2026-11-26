def climb(n):
    cache = {}
    def solve(i):
        if i <= 2:
            return i
        if i in cache:
            return cache[i]
        left = solve(i - 1)
        right = solve(i - 2)
        cache[i] = left + right
        return cache[i]
    return solve(n)


if __name__ == "__main__":
    print(climb(9))  # 55 routes
