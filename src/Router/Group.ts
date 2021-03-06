/**
 * @module @poppinss/http-server
 */

/*
* @poppinss/http-server
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/// <reference path="../contracts.ts" />

import { Macroable } from 'macroable'
import { Exception } from '@poppinss/utils'
import { RouteGroupContract } from '@poppinss/http-server/contracts'

import { Route } from './Route'
import { RouteResource } from './Resource'
import { BriskRoute } from './BriskRoute'
import { exceptionCodes } from '../helpers'

function missingRouteName () {
  return new Exception(
    'All routes inside a group must have names before calling Route.group.as',
    500,
    exceptionCodes.E_MISSING_ROUTE_NAME,
  )
}

/**
 * Group class exposes the API to take action on a group
 * of routes. The group routes must be pre-defined using
 * the constructor.
 */
export class RouteGroup<Context> extends Macroable implements RouteGroupContract<Context> {
  protected static _macros = {}
  protected static _getters = {}

  constructor (public routes: (Route<Context> | RouteResource<Context> | BriskRoute<Context>)[]) {
    super()
  }

  /**
   * Invokes a given method with params on the route instance or route
   * resource instance
   */
  private _invoke (
    route: Route<Context> | RouteResource<Context> | BriskRoute<Context>,
    method: string,
    params: any[],
  ) {
    if (route instanceof RouteResource) {
      route.routes.forEach((child) => {
        this._invoke(child, method, params)
      })
      return
    }

    if (route instanceof BriskRoute) {
      /* istanbul ignore else */
      if (route.route) {
        /**
         * Raise error when trying to prefix route name but route doesn't have
         * a name
         */
        if (method === 'as' && !route.route.name) {
          throw missingRouteName()
        }

        route.route[method](...params)
      }
      return
    }

    /**
     * Raise error when trying to prefix route name but route doesn't have
     * a name
     */
    if (method === 'as' && !route.name) {
      throw missingRouteName()
    }

    route[method](...params)
  }

  /**
   * Define Regex matchers for a given param for all the routes
   */
  public where (param: string, matcher: RegExp | string): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'where', [param, matcher])
    })

    return this
  }

  /**
   * Define prefix all the routes in the group
   */
  public prefix (prefix: string): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'prefix', [prefix])
    })

    return this
  }

  /**
   * Define domain for all the routes
   */
  public domain (domain: string): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'domain', [domain])
    })

    return this
  }

  /**
   * Prepend name to the routes name
   */
  public as (name: string): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'as', [name, true])
    })

    return this
  }

  /**
   * Prepend an array of middleware to all routes middleware
   */
  public middleware (middleware: any | any[]): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'middleware', [middleware, true])
    })

    return this
  }

  /**
   * Define namespace for all the routes inside the group
   */
  public namespace (namespace: string): this {
    this.routes.forEach((route) => {
      this._invoke(route, 'namespace', [namespace])
    })

    return this
  }
}
