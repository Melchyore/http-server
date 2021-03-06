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

import { Socket } from 'net'
import { IncomingMessage, ServerResponse } from 'http'
import { RequestContract, Request } from '@poppinss/request'
import { LoggerContract, getLogger } from '@poppinss/logger'
import { ResponseContract, Response } from '@poppinss/response'
import { RouteNode, HttpContextContract, ServerConfig } from '@poppinss/http-server/contracts'
import { makeUrl, getServerConfig } from '../helpers'

/**
 * Http context is passed to all route handlers, middleware,
 * error handler and server hooks.
 */
export class HttpContext implements HttpContextContract {
  public params?: any
  public subdomains?: any
  public route?: RouteNode<this>

  constructor (
    public request: RequestContract,
    public response: ResponseContract,
    public logger: LoggerContract,
  ) {}

  /**
   * Creates a new fake context instance for a given route.
   */
  public static create (
    routePattern: string,
    routeParams: any,
    req?: IncomingMessage,
    res?: ServerResponse,
    serverConfig?: ServerConfig,
  ) {
    req = req || new IncomingMessage(new Socket())
    res = res || new ServerResponse(req)

    /**
     * Composing server config
     */
    serverConfig = getServerConfig(serverConfig || {})

    /**
     * Creating the url from the router pattern and params. Only
     * when actual URL isn't defined.
     */
    req.url = req.url || makeUrl(routePattern, { params: routeParams })

    /**
     * Creating new request instance
     */
    const request = new Request(req, res, {
      allowMethodSpoofing: serverConfig.allowMethodSpoofing,
      subdomainOffset: serverConfig.subdomainOffset,
      trustProxy: serverConfig.trustProxy,
    })

    /**
     * Creating new response instance
     */
    const response = new Response(req, res, {
      etag: serverConfig.etag,
      cookie: serverConfig.cookie,
      jsonpCallbackName: serverConfig.jsonpCallbackName,
    })

    /**
     * Creating new ctx instance
     */
    const ctx = new HttpContext(request, response, getLogger({
      name: 'adonis',
      enabled: true,
      level: 'trace',
      messageKey: 'msg',
    }))

    /**
     * Attaching route to the ctx
     */
    ctx.route = {
      pattern: routePattern,
      middleware: [],
      handler: async () => 'handled',
      meta: {},
    }

    /**
     * Attaching params to the ctx
     */
    ctx.params = routeParams

    return ctx
  }
}
