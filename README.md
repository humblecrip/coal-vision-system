# 项目版本与依赖总览

更新时间：2025-11-25

## 前端（mineVision-vue）
- **项目名称**: `mineVision-vue`
- **版本**: `0.0.0`
- **构建工具**: Vite

依赖（`dependencies`，声明版本）：
- `vue`: `^3.5.24`
- `vue-router`: `^4.6.3`
- `sass`: `^1.94.2`

开发依赖（`devDependencies`，声明版本）：
- `vite`: `^7.2.4`
- `@vitejs/plugin-vue`: `^6.0.1`

> 以上来自 `mineVision-vue/package.json`。

---

## 后端（backend）
- **根坐标**: `com.cqupt:coal-vision-system:0.0.1-SNAPSHOT`
- **Java 版本**: `17`（由属性 `java.version` 指定）
- **Spring Boot 父 POM**: `org.springframework.boot:spring-boot-starter-parent:3.4.13-SNAPSHOT`
- **Maven 编译插件**: `org.apache.maven.plugins:maven-compiler-plugin:3.11.0`（`source/target/release`=17）
- **仓库**: 启用了 Spring Snapshots 仓库（用于父 POM 的 SNAPSHOT）

多模块结构（来自根 `backend/pom.xml`）：
- `web`
- `service`
- `dao`
- `common`
- `api`

### 模块依赖明细（声明版本）

#### `backend/api`
- 显式依赖：无

#### `backend/common`
- `org.projectlombok:lombok:1.18.36`
- `org.testng:testng:RELEASE`（scope: compile）

#### `backend/dao`
- `com.cqupt:coal-vision-system-common:0.0.1-SNAPSHOT`

#### `backend/service`
- `com.cqupt:coal-vision-system-dao:0.0.1-SNAPSHOT`

#### `backend/web`
- `com.cqupt:coal-vision-system-service:0.0.1-SNAPSHOT`
- `org.springframework.boot:spring-boot-starter-web`（继承父 POM 管理版本）

### 简要依赖关系图
- `web`
  - 依赖 `service`
    - 依赖 `dao`
      - 依赖 `common`
  - 依赖 `spring-boot-starter-web`
- `api`（当前未声明外部依赖）

> 以上来自各模块 `pom.xml`（`backend/*/pom.xml`）与根 `backend/pom.xml`。

---

## 备注
- 前端依赖为声明版本范围（如 `^` 前缀），实际安装版本以锁定文件与安装时间为准。
- 后端模块内部依赖统一使用 `0.0.1-SNAPSHOT`，外部依赖版本多数由 Spring Boot 父 POM 管理（未在模块内显式固定版本的依赖，将由父 BOM 统一对齐）。
