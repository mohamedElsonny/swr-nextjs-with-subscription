import { useMemo } from 'react'
import useSWR, { ConfigInterface } from 'swr'
import fetch from 'lib/fetch'
import subscribe from 'lib/subscribe'

interface QueryOptions {
  query: any
  document: any
}

const getData = (query: string) => async () => {
  return fetch({ query })
}

const subscribeData = (document) => async (...args) => {
  return subscribe(document)
}

export const useQuerySubscription = (
  { query, document }: QueryOptions,
  options: ConfigInterface
) => {
  const { data: queryData, error } = useSWR({ query }, getData(query), options)
  const { data: subData } = useSWR('subscription', subscribeData(document))
  const data = useMemo(() => returnSubbedData(queryData, subData), [queryData, subData])
  const loading = useMemo(() => {
    return !data
  }, [data])
  return {
    data,
    error,
    loading,
  }
}

function returnSubbedData(queryData, subData) {
  if (subData) {
    return subData
  }
  return queryData
}

export const fetchQueryData = (query) => {
  return getData(query)()
}
